# ─── General ────────────────────────────────────────────────────────────────
variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "iteria"
}

variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

# ─── VPC ─────────────────────────────────────────────────────────────────────
variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "CIDRs para subnets públicas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "CIDRs para subnets privadas (RDS)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "availability_zones" {
  description = "Zonas de disponibilidad"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# ─── EC2 ─────────────────────────────────────────────────────────────────────
variable "ec2_instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.micro"
}

variable "ec2_ami_id" {
  description = "AMI ID (Ubuntu 22.04 LTS en us-east-1)"
  type        = string
  default     = "ami-0c7217cdde317cfec"
}

variable "ec2_key_name" {
  description = "Nombre del key pair para SSH"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "IP desde donde se permite SSH (ej: tu IP pública)"
  type        = string
  default     = "0.0.0.0/0"
}

# ─── RDS ─────────────────────────────────────────────────────────────────────
variable "db_name" {
  description = "Nombre de la base de datos PostgreSQL"
  type        = string
  default     = "iteria_db"
}

variable "db_username" {
  description = "Usuario de la base de datos"
  type        = string
  default     = "iteria_admin"
}

variable "db_password" {
  description = "Contraseña de la base de datos"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "Clase de instancia RDS"
  type        = string
  default     = "db.t3.micro"
}
