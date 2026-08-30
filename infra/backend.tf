terraform {
  required_version = ">= 1.11.0"

  backend "s3" {
    bucket       = "fpl-duo-leaderboard-tfstate" # must be globally unique
    key          = "infra/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
    encrypt      = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
