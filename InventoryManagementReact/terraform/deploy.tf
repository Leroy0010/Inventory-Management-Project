resource "null_resource" "upload_dist" {
  triggers = {
    # Forces this resource to run on every 'terraform apply'
    always_run = timestamp() 
  }

  provisioner "local-exec" {
    command = <<EOT
      Write-Host "Starting robust build upload to S3 and CloudFront invalidation..."

      # Set AWS credentials and region for deployment
      $env:AWS_ACCESS_KEY_ID="${aws_iam_access_key.deploy_user_key.id}"
      $env:AWS_SECRET_ACCESS_KEY="${aws_iam_access_key.deploy_user_key.secret}"
      $env:AWS_DEFAULT_REGION="${var.aws_region}" # Set region from variables.tf
      
      $BUCKET = "s3://${aws_s3_bucket.app_bucket.bucket}";
      $DIST_PATH = "../dist"; # ASSUMPTION: 'dist' is one level up from 'terraform' directory
      $CF_ID = "${aws_cloudfront_distribution.app_distribution.id}";
      
      Write-Host "--------------------------------------------------------"
      Write-Host "DEBUG: Verifying files in $DIST_PATH..."
      dir $DIST_PATH
      Write-Host "--------------------------------------------------------"

      # 1. Sync ALL assets (excluding index.html)
      # This performs deletion of old files, guesses MIME types for all, and sets long-term cache
      aws s3 sync "$DIST_PATH/" "$BUCKET/" `
        --delete `
        --exclude "index.html" `
        --cache-control "public, max-age=31536000, immutable" `
        --guess-mime-type

      # 2. Upload index.html explicitly
      # This must have NO-CACHE to ensure the browser always re-validates it and downloads new assets
      aws s3 cp "$DIST_PATH/index.html" "$BUCKET/index.html" `
        --content-type "text/html" `
        --cache-control "no-cache, no-store, must-revalidate"

      Write-Host "Upload completed successfully. Starting CloudFront Invalidation..."

      # 3. CRITICAL STEP: Invalidate the entire cache to deploy the new index.html and assets
      aws cloudfront create-invalidation `
        --distribution-id "$CF_ID" `
        --paths "/*"
        
      Write-Host "CloudFront invalidation submitted! This can take 5-15 minutes to complete."
      Write-Host "CloudFront URL: https://${aws_cloudfront_distribution.app_distribution.domain_name}"
    EOT
    interpreter = ["PowerShell", "-Command"]
  }

  depends_on = [
    aws_s3_bucket.app_bucket,
    aws_cloudfront_distribution.app_distribution
  ]
}