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
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── VPC & Networking ────────────────────────────────────────────────────────
module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  availability_zones = var.availability_zones
}

# ─── Secrets Manager ─────────────────────────────────────────────────────────
module "secrets" {
  source = "./modules/secrets"

  project_name = var.project_name
  environment  = var.environment
  db_username  = var.db_username
  db_name      = var.db_name
  db_host      = module.rds.db_endpoint
}

# ─── EC2 (Express Backend) ───────────────────────────────────────────────────
module "ec2" {
  source = "./modules/ec2"

  project_name      = var.project_name
  environment       = var.environment
  instance_type     = var.ec2_instance_type
  ami_id            = var.ec2_ami_id
  key_name          = var.ec2_key_name
  subnet_id         = module.vpc.public_subnet_ids[0]
  vpc_id            = module.vpc.vpc_id
  allowed_ssh_cidr  = var.allowed_ssh_cidr
  db_host           = module.rds.db_endpoint
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = module.secrets.db_password
  secret_arn        = module.secrets.secret_arn
  s3_bucket_name    = module.s3.bucket_name
  aws_region        = var.aws_region
}

# ─── RDS (PostgreSQL) ────────────────────────────────────────────────────────
module "rds" {
  source = "./modules/rds"

  project_name        = var.project_name
  environment         = var.environment
  db_name             = var.db_name
  db_username         = var.db_username
  db_password         = module.secrets.db_password
  db_instance_class   = var.db_instance_class
  subnet_ids          = module.vpc.private_subnet_ids
  vpc_id              = module.vpc.vpc_id
  ec2_security_group  = module.ec2.security_group_id
}

# ─── S3 (Assets / Uploads) ───────────────────────────────────────────────────
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}

# ─── EKS (Kubernetes Cluster) ────────────────────────────────────────────────
module "eks" {
  source = "./modules/eks"

  project_name   = var.project_name
  environment    = var.environment
  subnet_ids     = module.vpc.public_subnet_ids
  instance_types = var.eks_instance_types
  desired_size   = var.eks_desired_size
  min_size       = var.eks_min_size
  max_size       = var.eks_max_size
}
