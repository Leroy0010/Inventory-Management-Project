# rds.tf
resource "aws_db_subnet_group" "postgres_subnet_group" {
  name       = "springboot-postgres-subnet-group"
  subnet_ids = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

resource "aws_db_instance" "postgres" {
  identifier             = "springboot-postgres-db"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  username               = "leroy"
  password               = "leroydennis001"
  db_subnet_group_name   = aws_db_subnet_group.postgres_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = true
  skip_final_snapshot    = true
  deletion_protection    = false

  # ADD THIS LINE:
  db_name = "InventoryManagementDB" # <-- This is the database your application needs

  tags = {
    Name = "springboot-postgres"
  }
}


