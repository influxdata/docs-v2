---
title: InfluxDB Cloud 2.0 pricing plans
description: >
  InfluxDB Cloud 2.0 provides two pricing plans to fit your needs – the rate-limited
  Free Plan and the Usage-based Plan.
aliases:
  - /v2.0/cloud/rate-limits/
  - /v2.0/cloud/pricing-plans/
weight: 102
menu:
  v2_0:
    parent: Account management
    name: Pricing plans
products: [cloud]
---

InfluxDB Cloud 2.0 offers two pricing plans:

- [Free Plan](#free-plan)
- [Usage-Based Plan](#usage-based-plan)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud 2.0 pricing calculator](/v2.0/account-management/pricing-calculator/). -->

## Free Plan

All new {{< cloud-name >}} accounts start with a rate-limited Free Plan.
Use this plan as much and as long as you want within the Free Plan rate limits:

#### Free Plan rate limits

- **Data In:** 5.1MB every 5 minutes
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


_To remove rate limits, [upgrade to a Usage-based Plan](/v2.0/account-management/billing/#upgrade-to-usage-based-plan)._

## Usage-Based Plan

The Usage-Based Plan offers more flexibility and ensures you only pay for what you [use](/v2.0/account-management/data-usage/).

### Pricing vectors

The following two vectors determine pricing:

- **Data out** is the total sum of the data (measured in GB) returned to the user to answer a query, also known as data transfer costs.
- **Query count** is the total number of individual query operations. Each individual operation — including
queries, tasks, alert checks, notifications, and Data Explorer activity — is one billable query operation. Refreshing a dashboard with multiple cells counts as one query operation per cell. A query run through an API request counts as an operation. Failed query or task executions do not add to your query count.


### Usage-Based Plan rate limits

To protect against any intentional or unintentional harm, Usage-Based Plans include soft rate limits:

- **Data In:** Write 300MB every 5 minutes
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
