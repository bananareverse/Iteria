# ─── Security Group para EC2 ──────────────────────────────────────────────────
resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-${var.environment}-ec2-sg"
  description = "Security group para el backend Express de Iteria"
  vpc_id      = var.vpc_id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
    description = "SSH"
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS"
  }

  # API Express (puerto 3000)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Express API"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-ec2-sg"
    Project     = var.project_name
    Environment = var.environment
  }
}

# ─── IAM Role para EC2 (acceso a S3) ─────────────────────────────────────────
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "ec2_s3_policy" {
  name = "${var.project_name}-${var.environment}-ec2-s3-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ]
      Resource = [
        "arn:aws:s3:::${var.s3_bucket_name}",
        "arn:aws:s3:::${var.s3_bucket_name}/*"
      ]
    }]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# ─── EC2 Instance ─────────────────────────────────────────────────────────────
resource "aws_instance" "backend" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
    #!/bin/bash
    set -e
    apt-get update -y
    snap install docker
    sleep 30
    groupadd -f docker
    usermod -aG docker ubuntu
    apt-get install -y git
    mkdir -p /home/ubuntu/iteria
    chown ubuntu:ubuntu /home/ubuntu/iteria
    sudo -u ubuntu git clone https://github.com/bananareverse/Iteria.git /home/ubuntu/iteria
    echo "services:" > /home/ubuntu/iteria/docker-compose.yml
    echo "  frontend:" >> /home/ubuntu/iteria/docker-compose.yml
    echo "    build:" >> /home/ubuntu/iteria/docker-compose.yml
    echo "      context: ./frontend" >> /home/ubuntu/iteria/docker-compose.yml
    echo "      dockerfile: Dockerfile" >> /home/ubuntu/iteria/docker-compose.yml
    echo "      args:" >> /home/ubuntu/iteria/docker-compose.yml
    echo "        - VITE_SUPABASE_URL=https://tsixhsorzalbzozmzedl.supabase.co" >> /home/ubuntu/iteria/docker-compose.yml
    echo "        - VITE_SUPABASE_ANON_KEY=sb_publishable_TQlIfSsRPSdd-XHMuD9Fqg_a_M7floy" >> /home/ubuntu/iteria/docker-compose.yml
    echo "    ports:" >> /home/ubuntu/iteria/docker-compose.yml
    echo "      - '80:5173'" >> /home/ubuntu/iteria/docker-compose.yml
    echo "    restart: unless-stopped" >> /home/ubuntu/iteria/docker-compose.yml
    chown ubuntu:ubuntu /home/ubuntu/iteria/docker-compose.yml
    cd /home/ubuntu/iteria
    docker compose up -d --build
    echo "Iteria desplegado correctamente"
  EOF

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-backend"
    Project     = var.project_name
    Environment = var.environment
    Role        = "backend"
  }
}

# ─── Elastic IP ───────────────────────────────────────────────────────────────
resource "aws_eip" "backend" {
  instance = aws_instance.backend.id
  domain   = "vpc"

  tags = {
    Name    = "${var.project_name}-${var.environment}-eip"
    Project = var.project_name
  }
}
