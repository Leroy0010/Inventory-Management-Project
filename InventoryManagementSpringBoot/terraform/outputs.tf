# outputs.tf


output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.springboot_service.name
}
