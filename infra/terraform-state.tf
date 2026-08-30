resource "aws_s3_bucket" "tfstate" {
  bucket = "fpl-duo-leaderboard-tfstate"

  lifecycle {
    prevent_destroy = true # state bucket should never be destroyed
  }
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled" # enables recovery of previous state file if something corrupts it
  }
}
