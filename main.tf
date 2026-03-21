terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.9"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── VPC & Networking ────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-vpc"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name    = "${var.project_name}-${var.environment}-igw"
    Project = var.project_name
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-public-${count.index + 1}"
    Project     = var.project_name
    Environment = var.environment
    Type        = "public"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "${var.project_name}-${var.environment}-private-${count.index + 1}"
    Project     = var.project_name
    Environment = var.environment
    Type        = "private"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name    = "${var.project_name}-${var.environment}-public-rt"
    Project = var.project_name
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ─── Security Groups ──────────────────────────────────────────────────────────
resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-${var.environment}-ec2-sg"
  description = "Security group para EC2"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group para RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ─── Secrets Manager ──────────────────────────────────────────────────────────
resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}-${var.environment}-db-credentials-v1"
  description = "Credenciales para la base de datos RDS de Iteria"
  
  # Forzar borrado sin periodo de recuperación para pruebas
  recovery_window_in_days = 0 
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
    engine   = "postgres"
    host     = aws_db_instance.postgres.address
    port     = 5432
    dbname   = var.db_name
  })
}

# ─── RDS (PostgreSQL) ────────────────────────────────────────────────────────
resource "aws_db_subnet_group" "rds" {
  name       = "${var.project_name}-${var.environment}-rds-group-v5"
  subnet_ids = aws_subnet.private[*].id
}

resource "time_sleep" "wait_rds_group" {
  depends_on = [aws_db_subnet_group.rds]
  create_duration = "30s"
}

resource "aws_db_parameter_group" "postgres" {
  name   = "${var.project_name}-${var.environment}-pg15-v5"
  family = "postgres15"
}

resource "aws_db_instance" "postgres" {
  identifier        = "${var.project_name}-${var.environment}-db"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  db_name           = var.db_name
  username          = var.db_username
  password          = random_password.db_password.result

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.postgres.name

  skip_final_snapshot = true
  publicly_accessible = false

  depends_on = [time_sleep.wait_rds_group]
}

# ─── S3 ───────────────────────────────────────────────────────────────────────
resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "assets" {
  bucket        = "${var.project_name}-${var.environment}-assets-${random_id.suffix.hex}"
  force_destroy = true 
}

# ─── EC2 (IAM & Instance) ─────────────────────────────────────────────────────
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role-v2"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "ec2_policy" {
  name = "${var.project_name}-${var.environment}-combined-policy"
  role = aws_iam_role.ec2_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:*"]
        Resource = [aws_s3_bucket.assets.arn, "${aws_s3_bucket.assets.arn}/*"]
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = [aws_secretsmanager_secret.db_credentials.arn]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-${var.environment}-ec2-profile-v2"
  role = aws_iam_role.ec2_role.name
}

resource "aws_instance" "backend" {
  ami                    = var.ec2_ami_id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  key_name               = var.ec2_key_name

  user_data = <<-EOF
    #!/bin/bash
    # Instalar AWS CLI y jq para parsear el JSON del secreto
    apt-get update -y
    apt-get install -y awscli jq

    # Recuperar credenciales de Secrets Manager
    SECRET_ARN="${aws_secretsmanager_secret.db_credentials.arn}"
    REGION="${var.aws_region}"
    
    CREDENTIALS=$(aws secretsmanager get-secret-value --secret-id $SECRET_ARN --region $REGION --query SecretString --output text)
    
    DB_PASSWORD=$(echo $CREDENTIALS | jq -r .password)
    DB_HOST=$(echo $CREDENTIALS | jq -r .host)

    echo "DB_PASSWORD=$DB_PASSWORD" >> /etc/environment
    echo "DB_HOST=$DB_HOST" >> /etc/environment
    echo "SECRET_LOADED=true" >> /etc/environment
  EOF

  tags = {
    Name = "${var.project_name}-${var.environment}-backend"
  }
}

resource "aws_eip" "backend" {
  instance = aws_instance.backend.id
  domain   = "vpc"
}

# ─── Outputs ─────────────────────────────────────────────────────────────────
output "ec2_public_ip" {
  value = aws_eip.backend.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "secret_arn" {
  value = aws_secretsmanager_secret.db_credentials.arn
}
