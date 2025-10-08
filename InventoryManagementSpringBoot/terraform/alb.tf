# alb.tf

# ===========================================
# Application Load Balancer (Public)
# ===========================================
resource "aws_lb" "app_lb" {
  name               = "springboot-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  enable_deletion_protection = false

  tags = {
    Name = "springboot-alb"
  }
}

# ===========================================
# Target Group (HTTP to ECS)
# ===========================================
resource "aws_lb_target_group" "app_tg" {
  name        = "springboot-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/actuator/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
    matcher             = "200-499"
  }

  tags = {
    Name = "springboot-tg"
  }
}

# ===========================================
# HTTP Listener (forward traffic or redirect if HTTPS is enabled)
# ===========================================
resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"

  # For now: forward traffic directly to target group
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }

  tags = {
    Name = "springboot-http-listener"
  }
}

# ===========================================
# HTTPS Listener (optional, only enable after you have a domain and ACM cert)
# ===========================================
# Uncomment this block after you request a valid ACM certificate
# and update certificate_arn with your certificate ARN
#
# resource "aws_lb_listener" "https_listener" {
#   load_balancer_arn = aws_lb.app_lb.arn
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-2016-08"
#   certificate_arn   = "<YOUR_ACM_CERTIFICATE_ARN>"
#
#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.app_tg.arn
#   }
#
#   tags = {
#     Name = "springboot-https-listener"
#   }
# }
#
# # Optional: redirect HTTP → HTTPS automatically once HTTPS listener exists
# resource "aws_lb_listener_rule" "http_to_https_redirect" {
#   listener_arn = aws_lb_listener.http_listener.arn
#
#   action {
#     type = "redirect"
#     redirect {
#       port        = "443"
#       protocol    = "HTTPS"
#       status_code = "HTTP_301"
#     }
#   }
#
#   condition {
#     host_header {
#       values = ["*"]
#     }
#   }
# }

# ===========================================
# ECS Service (with ALB integration)
# ===========================================
resource "aws_ecs_service" "springboot_service" {
  name                               = "springboot-service"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.springboot.arn
  desired_count                      = 1
  launch_type                        = "FARGATE"
  health_check_grace_period_seconds  = 60
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups  = [aws_security_group.ecs_sg.id] # <- use ecs_sg, not alb_sg
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "springboot-inventory"
    container_port   = 8080
  }

  depends_on = [
    aws_lb_listener.http_listener
  ]
}

# ===========================================
# Output
# ===========================================
output "alb_dns_name" {
  description = "Public URL of the Application Load Balancer"
  value       = aws_lb.app_lb.dns_name
}
