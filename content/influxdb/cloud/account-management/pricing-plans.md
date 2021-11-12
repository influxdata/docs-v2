---
title: InfluxDB Cloud plans
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

InfluxDB Cloud offers a [Free Plan](#free-plan), a [Usage-Based Plan](#usage-based-plan) to pay as you go, and a discounted [Annual Plan](#annual-plan).

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Free Plan

All new {{< cloud-name >}} accounts start with Free Plan that provides a limited number of resources and data usage. See [plan limits](/influxdb/cloud/account-management/limits/).

## Usage-Based Plan

The Usage-Based Plan offers more flexibility and ensures you only pay for what you [use](/influxdb/cloud/account-management/data-usage/). Usage-Based Plans are based on consumption as measured by usage on the [pricing vectors](#pricing-vectors).

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

## Annual Plan
<!-- Maybe this should be "annual commitment"? -->

An Annual Plan offers a discount for a commitment to a specific amount of usage over set period of time. This plan uses the same pricing vectors and calculation methodology as Usage-Based Plans.

__Interested in an Annual Plan? Reach out to [InfluxData Sales](https://www.influxdata.com/contact-sales/).__

<!-- ## Pricing FAQs -->
