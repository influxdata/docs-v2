---
title: InfluxDB Cloud 2.0 pricing plans
description: >
  InfluxDB Cloud 2.0 provides two pricing plans to fit your needs – the rate-limited
  Free Plan and the Usage-based Plan.
aliases:
  - /influxdb/v2.0/cloud/rate-limits/
  - /influxdb/v2.0/cloud/pricing-plans/
weight: 102
menu:
  influxdb_2_0:
    parent: Account management
    name: Pricing plans
products: [cloud]
influxdb/v2.0/tags: [VPC]
---

InfluxDB Cloud 2.0 offers two pricing plans:

- [Free Plan](#free-plan)
- [Usage-based Plan](#usage-based-plan)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud 2.0 pricing calculator](/influxdb/v2.0/account-management/pricing-calculator/). -->

## Free Plan

All new {{< cloud-name >}} accounts start with a rate-limited Free Plan.
Use this plan as much and as long as you want within the Free Plan rate limits:

#### Free Plan rate limits

- **Writes:** 5.1MB every 5 minutes
- **Query:** 300MB every 5 minutes
- **Storage:** 30-day data retention
{{% note %}}
Data retention is determined by the time at which data is written to InfluxDB; not the timestamp of the data point. You can write data with timestamps older than 30 days, but 30 days after that data is written, it is evicted.
{{% /note %}}
- **Series cardinality:** 10,000
- **Create:**
  - Up to 5 dashboards
  - Up to 5 tasks
  - Up to 2 buckets
  - Up to 2 checks
  - Up to 2 notification rules
  - Unlimited Slack notification endpoints


_To remove rate limits, [upgrade to a Usage-based Plan](/influxdb/v2.0/account-management/billing/#upgrade-to-usage-based-plan)._

## Usage-based Plan

The Usage-based Plan offers more flexibility and ensures you only pay for what you [use](/influxdb/v2.0/account-management/data-usage/).

#### Usage-based Plan rate limits

To protect against any intentional or unintentional harm, Usage-based Plans include soft rate limits:

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

{{% cloud %}}
#### VPC peering

If you are interested in adding virtual private cloud (VPC) peering to your Cloud account, please [contact sales](https://www.influxdata.com/contact-sales/) to discuss the options and associated pricing.
{{% /cloud %}}
