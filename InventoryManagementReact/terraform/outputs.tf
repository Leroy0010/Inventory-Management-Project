output "deploy_user_access_key" {
  value     = aws_iam_access_key.deploy_user_key.id
  sensitive = true
}

output "deploy_user_secret_key" {
  value     = aws_iam_access_key.deploy_user_key.secret
  sensitive = true
}

output "s3_bucket_name" {
  value = aws_s3_bucket.app_bucket.bucket
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.app_distribution.domain_name
}
