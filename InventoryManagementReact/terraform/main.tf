#############################
# S3 Bucket for React Build #
#############################

resource "aws_s3_bucket" "app_bucket" {
  bucket = "${var.app_name}-bucket"

  tags = {
    Name = "${var.app_name}-bucket"
  }
}

# BEST PRACTICE: Enforce Bucket Owner controls (required for private buckets in modern AWS)
resource "aws_s3_bucket_ownership_controls" "app_bucket_ownership" {
  bucket = aws_s3_bucket.app_bucket.id
  rule {
    # BucketOwnerEnforced disables ACLs and makes the bucket owner the owner of all objects
    object_ownership = "BucketOwnerEnforced" 
  }
}

resource "aws_s3_bucket_public_access_block" "app_bucket_block" {
  bucket = aws_s3_bucket.app_bucket.id

  # These settings make the bucket private (no public access)
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CRITICAL FIX: Removed aws_s3_bucket_website_configuration. 
# CloudFront handles the default_root_object and error_document (SPA routing).

resource "aws_s3_bucket_policy" "app_bucket_policy" {
  bucket = aws_s3_bucket.app_bucket.id
  policy = data.aws_iam_policy_document.cloudfront_s3_access.json
}

# Use a data block to define the policy document clearly
data "aws_iam_policy_document" "cloudfront_s3_access" {
  statement {
    sid    = "AllowCloudFrontOacAccess"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions = [
      "s3:GetObject",
    ]
    resources = [
      "${aws_s3_bucket.app_bucket.arn}/*",
    ]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      # The CloudFront distribution ARN is used here to restrict access only to this CDN
      values   = [aws_cloudfront_distribution.app_distribution.arn] 
    }
  }
}

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.app_name}-oac"
  description                       = "OAC for ${var.app_name} S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"

  lifecycle {
    create_before_destroy = true
  }
}


##################################
# CloudFront Distribution (HTTPS)
##################################

resource "aws_cloudfront_distribution" "app_distribution" {
  enabled             = true
  wait_for_deployment = false
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # Add dependency on Ownership Controls
  depends_on = [
    aws_s3_bucket_ownership_controls.app_bucket_ownership
  ]

  origin {
    # Correctly uses the regular S3 regional domain name (NOT the website endpoint)
    domain_name              = aws_s3_bucket.app_bucket.bucket_regional_domain_name 
    origin_id                = "S3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id           = "S3Origin"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]

    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  # Custom error responses for SPA routing (Correctly implemented)
  dynamic "custom_error_response" {
    for_each = [403, 404]
    content {
      error_caching_min_ttl = 300
      error_code            = custom_error_response.value
      response_code         = 200
      response_page_path    = "/index.html"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name         = "${var.app_name}-distribution"
    LastDeployed = timestamp()
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Use managed cache policy (Data block is correct)
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# Security headers policy (Resource is correct)
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "${var.app_name}-security-headers"

  security_headers_config {
    content_security_policy {
      # NOTE: Your CSP is permissive with 'unsafe-inline' and 'unsafe-eval'
      # You should tighten this if possible, but it's acceptable for many React/Vite builds.
      content_security_policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
      override                = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
  }
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.app_distribution.domain_name}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.app_distribution.id
}