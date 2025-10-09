resource "null_resource" "upload_dist" {
  triggers = {
    always_run = timestamp() 
  }

   provisioner "local-exec" {
    command = <<EOT
      echo "Starting deployment with debug output..."

      # Set AWS credentials and region
      export AWS_ACCESS_KEY_ID="${aws_iam_access_key.deploy_user_key.id}"
      export AWS_SECRET_ACCESS_KEY="${aws_iam_access_key.deploy_user_key.secret}"
      export AWS_DEFAULT_REGION="${var.aws_region}"

      BUCKET="s3://${aws_s3_bucket.app_bucket.bucket}"
      DIST_PATH="../dist"
      CF_ID="${aws_cloudfront_distribution.app_distribution.id}"

      echo "=== DEBUG ==="
      echo "Files that would be synced:"
      find "$DIST_PATH" -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -10

      echo "=== SYNC (dry run) ==="
      aws s3 sync "$DIST_PATH/" "$BUCKET/" --dryrun --exclude "index.html"

      echo "=== ACTUAL SYNC ==="
      aws s3 sync "$DIST_PATH/" "$BUCKET/" \
        --delete \
        --exclude "index.html" \
        --cache-control "public, max-age=31536000, immutable" \
        --metadata-directive "REPLACE" \
        --guess-mime-type

      echo "=== UPLOAD INDEX.HTML ==="
      aws s3 cp "$DIST_PATH/index.html" "$BUCKET/index.html" \
        --content-type "text/html" \
        --cache-control "no-cache, no-store, must-revalidate"

      echo "=== BUCKET CONTENTS ==="
      aws s3 ls "$BUCKET/" --recursive | head -10

      echo "=== CLOUDFRONT INVALIDATION ==="
      aws cloudfront create-invalidation \
        --distribution-id "$CF_ID" \
        --paths "/*"
        
      echo "Deployment completed successfully!"
      echo "CloudFront URL: https://${aws_cloudfront_distribution.app_distribution.domain_name}"
    EOT
    
    interpreter = ["bash", "-c"] 
  }

  depends_on = [
    aws_s3_bucket.app_bucket,
    aws_cloudfront_distribution.app_distribution
  ]
}