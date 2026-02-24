output "ec2_public_ip" {
  description = "IP pública del servidor EC2 (Express Backend)"
  value       = module.ec2.public_ip
}

output "ec2_public_dns" {
  description = "DNS público del servidor EC2"
  value       = module.ec2.public_dns
}

output "rds_endpoint" {
  description = "Endpoint de la base de datos RDS PostgreSQL"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "s3_bucket_name" {
  description = "Nombre del bucket S3"
  value       = module.s3.bucket_name
}

output "s3_bucket_url" {
  description = "URL del bucket S3"
  value       = module.s3.bucket_url
}

output "vpc_id" {
  description = "ID de la VPC creada"
  value       = module.vpc.vpc_id
}

output "ssh_connection" {
  description = "Comando para conectarse al servidor por SSH"
  value       = "ssh -i ~/.ssh/${var.ec2_key_name}.pem ubuntu@${module.ec2.public_ip}"
}
