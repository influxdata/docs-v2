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

## Free Plan
All new {{< cloud-name >}} accounts start with a rate-limited Free Plan.
Use it as much and as long as you want within the Free Plan rate limits:

#### Free Plan rate limits
- **Writes:** 3MB every 5 minutes
- **Query:** 30MB every 5 minutes
- **Storage:** 72-hour data retention
- **Create:**
  - Up to 5 dashboards
  - Up to 5 tasks
  - Up to 2 buckets

_To remove rate limits, [upgrade to a Pay As You Go Plan](/v2.0/cloud/account-management/upgrade-to-payg/)._

## Pay As You Go Plan
Pay As You Go Plans offer more flexibility and ensure you only pay for what you use.

#### Pay As You Go Plan rate limits
In order to protect against any intentional or unintentional harm,
Pay As You Go Plans includes some soft rate limits:

- **Writes:** 300MB every 5 minutes
- **Queries:** 3000MB every 5 minutes
- **Storage:** Unlimited retention
- **Create:**
  - Unlimited dashboards
  - Unlimited tasks
  - Unlimited buckets
  - Unlimited users

_To request higher rate limits, contact [InfluxData Support](mailto:support@influxdata.com)._
