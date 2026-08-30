# ---------- GitHub OIDC provider (one-time, shared by all three roles) ----------

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# ---------- Role 1: App code deploy (Lambda code + frontend) ----------
# Trust: any workflow run in this repo. Ungated, this is meant to run on
# every push, no review needed, since it can only touch app code/assets,
# never infrastructure.

resource "aws_iam_role" "github_deploy_app" {
  name = "${var.project_name}-github-deploy-app"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }
        StringLike   = { "token.actions.githubusercontent.com:sub" = "repo:${var.github_org_repo}:*" }
      }
    }]
  })
}

resource "aws_iam_role_policy" "github_deploy_app" {
  name = "app-deploy"
  role = aws_iam_role.github_deploy_app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["lambda:UpdateFunctionCode"]
        Resource = aws_lambda_function.leaderboard.arn
      },
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
        Resource = [aws_s3_bucket.frontend.arn, "${aws_s3_bucket.frontend.arn}/*"]
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:CreateInvalidation"]
        Resource = "arn:aws:cloudfront::*:distribution/${aws_cloudfront_distribution.frontend.id}"
      }
    ]
  })
}

# ---------- Role 2: Terraform plan (read-only, ungated) ----------
# Trust: same as above, any push can trigger a plan, since a plan can't
# change anything, only compute and display a diff.

resource "aws_iam_role" "github_deploy_infra_plan" {
  name = "${var.project_name}-github-infra-plan"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }
        StringLike   = { "token.actions.githubusercontent.com:sub" = "repo:${var.github_org_repo}:*" }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "plan_readonly" {
  role       = aws_iam_role.github_deploy_infra_plan.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess" # AWS-managed: Describe/Get/List across services, no write actions at all
}

# ReadOnlyAccess grants no write actions whatsoever, but S3-native
# locking (use_lockfile) requires even a `plan` to briefly create and
# delete a .tflock object to hold the lock. This scopes write access to
# ONLY that one lock object, never the state file itself, plan still
# can't modify real state or infrastructure.
resource "aws_iam_role_policy" "plan_lockfile" {
  name = "state-lockfile-access"
  role = aws_iam_role.github_deploy_infra_plan.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"]
      Resource = "arn:aws:s3:::fpl-duo-leaderboard-tfstate/infra/terraform.tfstate.tflock"
    }]
  })
}

# ---------- Role 3: Terraform apply (write access, GATED) ----------
# Trust: the StringLike condition below requires the OIDC token's `sub`
# claim to say the job ran under the "infra-apply" GitHub Environment
# specifically, not just "any job in this repo". A workflow can only get
# that claim if it's configured with `environment: infra-apply`, and
# GitHub will only let that job run after a required reviewer approves.
# So even someone with push access to main cannot get write credentials
# without a human clicking approve, this is enforced on the AWS side,
# not just the GitHub UI side.

resource "aws_iam_role" "github_deploy_infra_apply" {
  name = "${var.project_name}-github-infra-apply"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }
        StringLike   = { "token.actions.githubusercontent.com:sub" = "repo:${var.github_org_repo}:environment:infra-apply" }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "apply_poweruser" {
  role       = aws_iam_role.github_deploy_infra_apply.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess" # everything except IAM management
}

# PowerUserAccess deliberately excludes IAM, this fills the gap for the
# specific IAM resources this project's Terraform manages (itself included).
resource "aws_iam_role_policy" "apply_iam_scoped" {
  name = "scoped-iam-management"
  role = aws_iam_role.github_deploy_infra_apply.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ProjectRoleManagement"
        Effect = "Allow"
        Action = [
          "iam:CreateRole", "iam:DeleteRole", "iam:GetRole",
          "iam:PutRolePolicy", "iam:DeleteRolePolicy", "iam:GetRolePolicy",
          "iam:AttachRolePolicy", "iam:DetachRolePolicy",
          "iam:ListRolePolicies", "iam:ListAttachedRolePolicies",
          "iam:TagRole", "iam:UntagRole", "iam:PassRole"
        ]
        Resource = "arn:aws:iam::*:role/${var.project_name}-*"
      },
      {
        Sid    = "GithubOIDCProviderManagement"
        Effect = "Allow"
        Action = [
          "iam:GetOpenIDConnectProvider", "iam:ListOpenIDConnectProviders",
          "iam:TagOpenIDConnectProvider", "iam:UpdateOpenIDConnectProviderThumbprint"
          # deliberately no Create/Delete: the provider itself was created
          # once during bootstrap and isn't something plan/apply should
          # ever need to recreate
        ]
        Resource = "arn:aws:iam::*:oidc-provider/token.actions.githubusercontent.com"
      }
    ]
  })
}
