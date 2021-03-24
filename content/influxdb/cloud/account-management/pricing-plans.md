---
title: InfluxDB Cloud pricing plans
description: >
  InfluxDB Cloud provides two pricing plans to fit your needs – the rate-limited
  Free Plan and the Usage-based Plan.
aliases:
  - /influxdb/v2.0/cloud/rate-limits/
  - /influxdb/v2.0/cloud/pricing-plans/
  - /influxdb/v2.0/pricing-plans/
weight: 102
menu:
  influxdb_cloud:
    parent: Account management
    name: Pricing plans
products: [cloud]
influxdb/cloud/tags: [VPC]
---

InfluxDB Cloud offers two pricing plans:

- [Free Plan](#free-plan)
- [Usage-Based Plan](#usage-based-plan)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Free Plan

All new {{< cloud-name >}} accounts start with a rate-limited Free Plan.
Use this plan as much and as long as you want within the Free Plan rate limits:

#### Free Plan rate limits

- **Data In:** 5.1MB every 5 minutes
- **Query:** 300MB every 5 minutes
- **Storage:** 30-day data retention
{{% note %}}
To write historical data older than 30 days or retain data for more than 30 days, upgrade to the Cloud [Usage-Based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan) plan.
{{% /note %}}
- **Series cardinality:** 10,000
- **Create:**
  - Up to 5 dashboards
  - Up to 5 tasks
  - Up to 2 buckets
  - Up to 2 checks
  - Up to 2 notification rules
  - Unlimited Slack notification endpoints

_To remove rate limits, [upgrade to a Usage-based Plan](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan)._

## Usage-Based Plan

The Usage-based Plan offers more flexibility and ensures you only pay for what you [use](/influxdb/cloud/account-management/data-usage/).

### Pricing vectors

The following two vectors determine pricing:

- **Data out** is the total sum of the data (measured in GB) returned to the user to answer a query, also known as data transfer costs.
- **Query count** is the total number of individual query operations. Each individual operation — including queries, tasks, alerts, notifications, and Data Explorer activity — is one billable query operation. Refreshing a dashboard with multiple cells will incur multiple query operations. Failed operations aren’t counted.
- **Data In** is the amount of data you’re writing into InfluxDB (measured in MB).
- **Storage** is the amount of data you’re storing in InfluxDB (measured in GB/hour).

### Usage-Based Plan rate limits

To protect against any intentional or unintentional harm, Usage-Based Plans include soft rate limits:

- **Data In:** 300MB every 5 minutes
- **Ingest batch size:** 50MB
- **Queries:** 3000MB every 5 minutes
- **Storage:** Unlimited retention
{{% note %}}
Increase the retention period up to 1 year by [updating a bucket’s retention policy in the InfluxDB UI](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-policy-in-the-influxdb-ui), or [set a custom retention period](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-policy) using the [`influx` CLI](influxdb/cloud/reference/cli/influx/).
{{% /note %}}
- **Series cardinality:** 1,000,000 initial limit (higher limits available; [contact InfluxData Support](mailto:support@influxdata.com))
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
