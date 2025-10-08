# providers.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    # ADD THE POSTGRESQL PROVIDER HERE
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.0" # Use a compatible version
    }
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region  = var.aws_region
  profile = "default"
}

# CONFIGURE THE POSTGRESQL PROVIDER
# This block uses the details of the AWS RDS instance defined in rds.tf
provider "postgresql" {
  # This will be the unique RDS endpoint (e.g., springboot-postgres-db.cvowe4uykhcg.eu-north-1.rds.amazonaws.com)
  host     = aws_db_instance.postgres.address
  port     = 5432
  username = aws_db_instance.postgres.username # "leroy"
  password = aws_db_instance.postgres.password # "leroy001"
  database = "postgres"                        # Connect to the default maintenance database
  sslmode  = "require"                         # Recommended for RDS
  superuser = false                            # AWS RDS user 'leroy' is not a superuser
  connect_timeout = 15                         # Optional: Add a timeout
}