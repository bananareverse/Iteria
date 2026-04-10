project_name = "iteria"
environment  = "prod"
aws_region   = "us-east-1"

# VPC
vpc_cidr           = "10.0.0.0/16"
public_subnets     = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets    = ["10.0.10.0/24", "10.0.11.0/24"]
availability_zones = ["us-east-1a", "us-east-1b"]

# EC2
ec2_instance_type = "t3.micro"
ec2_ami_id        = "ami-0c7217cdde317cfec"
ec2_key_name      = "iteria-key" # Basado en la documentación del README
allowed_ssh_cidr  = "0.0.0.0/0"

# RDS
db_name           = "iteria_db"
db_username       = "iteria_admin"
db_password       = "" # Se genera automáticamente en el Vault
db_instance_class = "db.t3.micro"

# EKS
eks_instance_types = ["t3.micro"]
eks_desired_size   = 2
eks_min_size       = 1
eks_max_size       = 4
