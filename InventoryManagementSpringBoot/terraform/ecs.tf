# ecs.tf

###############################
# ECS Cluster
###############################
resource "aws_ecs_cluster" "main" {
  name = "springboot-cluster"
}


###############################
# ECS Task Definition
###############################
resource "aws_ecs_task_definition" "springboot" {
  family                   = "springboot-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"    # 1 vCPU
  memory                   = "2048"    # 2 GB memory

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "springboot-inventory"
      image = "345204681275.dkr.ecr.eu-north-1.amazonaws.com/springboot-inventory:latest"

      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]

      # 1. Environment Variables (Static Config)
      environment = [
        # Fix: Enable Spring Boot to correctly process ALB's X-Forwarded-* headers
        { name = "SERVER_FORWARD_HEADERS_STRATEGY", value = "native" }, # <-- ADDED THIS LINE

        # Non-sensitive static configuration values:
        { name = "JWT_REFRESH_EXPIRATION", value = "7200000" },
        { name = "JWT_EXPIRATION", value = "1800000" },
        { name = "JWT_COOKIE_SAME_SITE", value = "None" },
        { name = "JWT_COOKIE_SECURE", value = "true" },
        { name = "JWT_COOKIE_NAME", value = "jwt"},
        { name = "JWT_MAX_TOKENS_PER_USER", value = "5"},
        { name = "JWT_COOKIE_HTTP_ONLY", value = "true" },
        { name = "JWT_COOKIE_DOMAIN", value = "" },
        { name = "GOOGLE_CLIENT_ID", value = "11976876973-ao6rgeaqlafv7sduuik80fl1gg5gg090.apps.googleusercontent.com" },
        { name = "GOOGLE_REDIRECT_URI", value = "http://springboot-alb-1463112470.eu-north-1.elb.amazonaws.com/login/oauth2/code/google" },
        { name = "MAIL_HOST", value = "smtp.gmail.com"},
        { name = "MAIL_PORT", value = "465" },
        { name = "MAIL_SMTP_STARTTLS_ENABLED", value = "false" },
        { name = "MAIL_SMTP_STARTTLS_REQUIRED", value = "false" },
        { name = "MAIL_SMTP_SSL_ENABLED", value = "true" },
        { name = "MAIL_SMTP_SSL_PROTOCOLS", value = "TLSv1.2" },
        { name = "MAIL_TEST_CONNECTION", value = "true" },
        { name = "FRONTEND_BASE_URL", value = "https://inventory-management-rm3l.onrender.com" },
        { name = "POSTGRES_DB", value = "InventoryManagementDB" },
        { name = "POSTGRES_USER", value = "postgres" }, # Note: If your app uses this, keep it. If it only uses SPRING_DATASOURCE_USERNAME, you can remove this duplicate.
        { name = "SERVER_PORT", value = "8080" },
        { name = "SPRING_PROFILES_ACTIVE", value = "prod" },
        { name = "AWS_S3_REGION", value = "eu-north-1" },
        { name = "AWS_S3_BUCKET_NAME", value = "inventory-item-images" },
        { name = "SERVER_CONTEXT_PATH", value = "/" },
        { name = "COOKIE_SECURE", value = "true" },
        { name = "COOKIE_SAME_SITE", value = "None" },
        { name = "COOKIE_DOMAIN", value = "" },
        { name = "COOKIE_MAX_AGE", value = "1800" },
        { name = "COOKIE_PATH", value = "/" },
        { name = "COOKIE_HTTP_ONLY", value = "true"},
        { name = "COOKIE_MAX_AGE", value = "1800"},
        { name = "SPRING_SESSION_TIMEOUT", value = "1800" },
        { name = "SPRING_SESSION_COOKIE_NAME", value = "JSESSIONID" },
        { name = "SPRING_SESSION_COOKIE_HTTP_ONLY", value = "true" },
        { name = "SPRING_SESSION_COOKIE_SECURE", value = "true" },
        { name = "SPRING_SESSION_COOKIE_SAME_SITE", value = "None" },
        { name = "SPRING_SESSION_COOKIE_MAX_AGE", value = "1800" },
        { name = "SPRING_SESSION_COOKIE_DOMAIN", value = "springboot-alb-1463112470.eu-north-1.elb.amazonaws.com" },
        { name = "SPRING_APPLICATION_NAME", value = "InventoryManagementSpringBoot" }
      ]

      # 2. Secrets Block (Sensitive Configuration from Secrets Manager and SSM Parameter)
      secrets = [
        # DB URL (MOVED HERE to ensure SSM Parameter is resolved by the ECS agent)
        {
          name      = "SPRING_DATASOURCE_URL"
          valueFrom = aws_ssm_parameter.db_url.arn
        },

        # DB Credentials
        {
          name      = "SPRING_DATASOURCE_USERNAME"
          valueFrom = "${aws_secretsmanager_secret.db_creds.arn}:username::"
        },
        {
          name      = "SPRING_DATASOURCE_PASSWORD"
          valueFrom = "${aws_secretsmanager_secret.db_creds.arn}:password::"
        },
        # POSTGRES_PASSWORD (If needed for the postgres service side)
        {
          name      = "POSTGRES_PASSWORD"
          valueFrom = "${aws_secretsmanager_secret.db_creds.arn}:password::"
        },

        # Application Secrets
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:JWT_SECRET::"
        },
        {
          name      = "GOOGLE_CLIENT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:GOOGLE_CLIENT_SECRET::"
        },
        {
          name      = "MAIL_USERNAME"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:MAIL_USERNAME::"
        },
        {
          name      = "MAIL_PASSWORD"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:MAIL_PASSWORD::"
        },
        {
          name      = "AWS_S3_SECRET_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AWS_S3_SECRET_KEY::"
        },
        {
          name      = "AWS_S3_ACCESS_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AWS_S3_ACCESS_KEY::"
        },
        {
          name      = "VAPID_PRIVATE_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:VAPID_PRIVATE_KEY::"
        },
        {
          name      = "VAPID_PUBLIC_KEY"
          valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:VAPID_PUBLIC_KEY::"
        }
      ]


      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.springboot.name
          awslogs-region        = "eu-north-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}