resource "aws_s3_bucket" "assets" {
  bucket        = "${var.project_name}-${var.environment}-assets-${random_id.suffix.hex}"
  force_destroy = false

  tags = {
    Name        = "${var.project_name}-${var.environment}-assets"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

# ─── Bloquear acceso público (archivos sirven por pre-signed URLs) ────────────
resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ─── Versionado ───────────────────────────────────────────────────────────────
resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ─── Encriptación ─────────────────────────────────────────────────────────────
resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ─── CORS (para subida de archivos desde el frontend) ────────────────────────
resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"] # En producción: reemplaza con tu dominio
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# ─── Lifecycle: mover archivos viejos a Glacier ───────────────────────────────
resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

rule {
    id     = "archive-old-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}
