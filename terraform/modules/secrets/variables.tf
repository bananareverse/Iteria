variable "project_name" { type = string }
variable "environment" { type = string }
variable "db_username" { type = string }
variable "db_name" { type = string }
variable "db_host" { type = string }
variable "secret_version" {
  type    = string
  default = "v1"
}
