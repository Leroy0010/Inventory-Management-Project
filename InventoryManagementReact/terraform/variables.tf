variable "app_name" {
  description = "Application name used for naming AWS resources"
  type        = string
  default     = "inventory-management-app"
}

# New Variable for deployment region
variable "aws_region" {
  description = "The AWS region where resources are deployed"
  type        = string
  default     = "eu-north-1"
}