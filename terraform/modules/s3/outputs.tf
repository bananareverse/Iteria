output "bucket_name" {
  value = aws_s3_bucket.assets.bucket
}

output "bucket_url" {
  value = "https://${aws_s3_bucket.assets.bucket}.s3.amazonaws.com"
}

output "bucket_arn" {
  value = aws_s3_bucket.assets.arn
}
