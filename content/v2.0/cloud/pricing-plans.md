---
title: InfluxDB Cloud 2.0 pricing plans
description: >
  InfluxDB Cloud 2.0 provides two pricing plans to fit your needs – the rate-limited
  Free Plan and the Pay As You Go Plan.
aliases:
  - /v2.0/cloud/rate-limits/
weight: 2
menu:
  v2_0_cloud:
    name: Pricing plans
---

InfluxDB Cloud 2.0 offers two pricing plans:

- [Free Plan](#free-plan)
- [Pay As You Go Plan](#pay-as-you-go-plan)

To estimate your projected usage costs, use the [InfluxDB Cloud 2.0 pricing calculator](/v2.0/cloud/pricing-calculator/).

## Free Plan

All new {{< cloud-name >}} accounts start with a rate-limited Free Plan.
Use this plan as much and as long as you want within the Free Plan rate limits:

#### Free Plan rate limits

- **Writes:** 3MB every 5 minutes
- **Query:** 30MB every 5 minutes
- **Storage:** 72-hour data retention
- **Series cardinality:** 10,000
- **Create:**
  - Up to 5 dashboards
  - Up to 5 tasks
  - Up to 2 buckets
  - Up to 2 checks
  - Up to 2 notification rules


_To remove rate limits, [upgrade to a Pay As You Go Plan](/v2.0/cloud/account-management/upgrade-to-payg/)._

## Pay As You Go Plan

Pay As You Go Plans offer more flexibility and ensure you only pay for what you use.

#### Pay As You Go Plan rate limits

To protect against any intentional or unintentional harm, Pay As You Go Plans include soft rate limits:

- **Writes:** 300MB every 5 minutes
- **Ingest batch size:** 50MB
- **Queries:** 3000MB every 5 minutes
- **Storage:** Unlimited retention
- **Series cardinality:** 1,000,000
- **Create:**
  - Unlimited dashboards
  - Unlimited tasks
  - Unlimited buckets
  - Unlimited users
  - Unlimited checks
  - Unlimited notification rules
  - Unlimited PagerDuty, Slack, and HTTP notification endpoints

_To request higher rate limits, contact [InfluxData Support](mailto:support@influxdata.com)._
