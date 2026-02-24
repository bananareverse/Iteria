variable "project_name" { type = string }
variable "environment" { type = string }
variable "instance_type" { type = string }
variable "ami_id" { type = string }
variable "key_name" { type = string }
variable "subnet_id" { type = string }
variable "vpc_id" { type = string }
variable "allowed_ssh_cidr" { type = string }
variable "db_host" { type = string }
variable "db_name" { type = string }
variable "db_username" { type = string }
variable "db_password" {
  type      = string
  sensitive = true
}
variable "s3_bucket_name" { type = string }
variable "aws_region" { type = string }
