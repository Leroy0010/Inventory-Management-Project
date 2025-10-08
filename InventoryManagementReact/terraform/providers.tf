terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# IMPORTANT: Set your target region here
provider "aws" {
  region = var.aws_region # Use the variable
}