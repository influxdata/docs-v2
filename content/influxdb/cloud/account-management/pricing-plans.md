---
title: InfluxDB Cloud pricing plans
description: >
  InfluxDB Cloud provides two pricing plans to fit your needs – the Free Plan and the Usage-based Plan.
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
---

InfluxDB Cloud offers two plans, which provide different data and resource usage limits:

- [Free Plan](#free-plan)
- [Usage-Based Plan](#usage-based-plan)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Free Plan

All new {{< cloud-name >}} accounts start with Free Plan that limits data and resource usage.
Use this plan as much and as long as you want within the Free Plan limits below.

### Data limits

- **Data In:** 5.1MB every 5 minutes
- **Query:** 300MB every 5 minutes
- **Series cardinality:** 10,000
- **Storage:** 30-day data retention


### Resource limits

  - 5 dashboards
  - 5 tasks
  - 2 buckets
  - 2 checks
  - 2 notification rules
  - Unlimited Slack notification endpoints

_To raise rate limits, [upgrade to a Usage-based Plan](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan)._

## Usage-Based Plan

The Usage-based Plan offers more flexibility and ensures you only pay for what you [use](/influxdb/cloud/account-management/data-usage/).

### Data limit

- **Ingest batch size:** 50MB

### Soft data limits

To protect against any intentional or unintentional harm, the Usage-Based Plan includes soft limits.
_To request higher soft data limits, contact [InfluxData Support](mailto:support@influxdata.com)._

- **Data In:** 300MB every 5 minutes
- **Query:** 3000MB every 5 minutes
- **Series cardinality:** 1,000,000 initial limit (higher limits available; [contact InfluxData Support](mailto:support@influxdata.com))
- **Storage:** Unlimited retention
{{% note %}}
Set your retention period to unlimited or up to 1 year by [updating a bucket’s retention period in the InfluxDB UI](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-period-in-the-influxdb-ui), or [set a custom retention period](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-period) using the [`influx` CLI](influxdb/cloud/reference/cli/influx/).
{{% /note %}}

### Pricing vectors

The Usage-Based Plan uses the following pricing vectors to calculate InfluxDB Cloud billing costs:

- **Data out** is the total sum of the data (measured in GB) returned to the user to answer a query, also known as data transfer costs.
- **Query count** is the total number of individual query operations:
   - Each individual operation—including queries, tasks, alerts, notifications, and Data Explorer activity—is one billable query operation.
   - Refreshing a dashboard with multiple cells will incur multiple query operations.
   - Failed operations aren’t counted.
- **Data In** is the amount of data you’re writing into InfluxDB (measured in MB/second).
- **Storage** is the amount of data you’re storing in InfluxDB (measured in GB/hour).

Discover how to [manage InfluxDB Cloud billing](/influxdb/cloud/account-management/billing/).

### Unlimited resources

  - Dashboards
  - Tasks
  - Buckets
  - Users
  - Checks
  - Notification rules
  - PagerDuty, Slack, and HTTP notification endpoints
