variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Used as a prefix for resource names"
  type        = string
  default     = "fpl-duo-leaderboard"
}

variable "github_org_repo" {
  description = "org/repo, e.g. jordanp/FPL-Duo-Leaderboard — used to scope the OIDC trust policy"
  type        = string
}
