resource "aws_iam_user" "deploy_user" {
  name = "terraform-frontend-deployer"
}

resource "aws_iam_access_key" "deploy_user_key" {
  user = aws_iam_user.deploy_user.name
}

resource "aws_iam_policy" "deploy_policy" {
  name        = "terraform-frontend-deployer-policy"
  description = "Policy to deploy React app to S3 + CloudFront (Least Privilege)"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # 1. S3 Permissions: Allows the deploy user to sync files to the SPECIFIC bucket
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:PutObjectAcl",
        ]
        Resource = [
          aws_s3_bucket.app_bucket.arn,
          "${aws_s3_bucket.app_bucket.arn}/*",
        ]
      },
      # 2. CloudFront Invalidation: Allows the user to create an invalidation on the SPECIFIC distribution
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = [
          aws_cloudfront_distribution.app_distribution.arn,
        ]
      },
      # 3. CloudFront Read-Only: Allows listing/getting distributions (needed for CLI/console)
      {
        Effect = "Allow"
        Action = [
          "cloudfront:GetDistribution",
          "cloudfront:ListDistributions"
        ]
        Resource = "*"
      },
      # 4. ACM Read-Only (Required if you use a custom domain/certificate in the future)
      {
        Effect = "Allow"
        Action = [
          "acm:ListCertificates"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "attach_deploy_policy" {
  user       = aws_iam_user.deploy_user.name
  policy_arn = aws_iam_policy.deploy_policy.arn
}