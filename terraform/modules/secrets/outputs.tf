output "secret_arn" {
  value = aws_secretsmanager_secret.db_credentials.arn
}

output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}
