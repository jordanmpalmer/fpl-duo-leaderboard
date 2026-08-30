output "api_base_url" {
  description = "Set as API_BASE_URL in GitHub repo variables"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_id" {
  description = "Set as CLOUDFRONT_DISTRIBUTION_ID in GitHub repo variables"
  value       = aws_cloudfront_distribution.frontend.id
}

output "frontend_bucket_name" {
  description = "Set as FRONTEND_BUCKET in GitHub repo variables"
  value       = aws_s3_bucket.frontend.bucket
}

output "lambda_function_name" {
  description = "Set as LAMBDA_FUNCTION_NAME in GitHub repo variables"
  value       = aws_lambda_function.leaderboard.function_name
}

output "github_deploy_app_role_arn" {
  description = "Set as AWS_DEPLOY_ROLE_ARN in GitHub repo variables (used by deploy.yml)"
  value       = aws_iam_role.github_deploy_app.arn
}

output "github_infra_plan_role_arn" {
  description = "Set as AWS_INFRA_PLAN_ROLE_ARN in GitHub repo variables (used by terraform.yml plan job)"
  value       = aws_iam_role.github_deploy_infra_plan.arn
}

output "github_infra_apply_role_arn" {
  description = "Set as AWS_INFRA_APPLY_ROLE_ARN in GitHub repo variables (used by terraform.yml apply job)"
  value       = aws_iam_role.github_deploy_infra_apply.arn
}
