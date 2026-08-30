data "aws_acm_certificate" "site" {
  domain      = "sonsofwisconsin.com"
  statuses    = ["ISSUED"]
  most_recent = true
}

data "aws_route53_zone" "site" {
  name = "sonsofwisconsin.com"
}

resource "aws_route53_record" "apex" {
  zone_id = data.aws_route53_zone.site.zone_id
  name    = "sonsofwisconsin.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id # CloudFront's fixed zone ID, not this project's
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.site.zone_id
  name    = "www.sonsofwisconsin.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}
