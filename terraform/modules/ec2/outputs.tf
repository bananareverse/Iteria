output "public_ip" {
  value = aws_eip.backend.public_ip
}

output "public_dns" {
  value = aws_instance.backend.public_dns
}

output "instance_id" {
  value = aws_instance.backend.id
}

output "security_group_id" {
  value = aws_security_group.ec2.id
}
