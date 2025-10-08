# cloudwatch.tf

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "springboot" {
  name              = "/ecs/springboot-service" # must match ECS log config exactly
  retention_in_days = 14
}


