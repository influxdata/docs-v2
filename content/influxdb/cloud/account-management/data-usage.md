---
title: View InfluxDB Cloud data usage
list_title: View data usage
description: >
  View your InfluxDB Cloud data usage and rate limit notifications.
weight: 103
aliases:
  - /influxdb/v2/account-management/data-usage
  - /influxdb/v2/cloud/account-management/data-usage
menu:
  influxdb_cloud:
    parent: Account management
    name: View data usage
related:
  - /flux/v0/stdlib/experimental/usage/from/
  - /flux/v0/stdlib/experimental/usage/limits/
alt_links:
  cloud-serverless: /influxdb3/cloud-serverless/admin/billing/data-usage/
---

View the statistics of your data usage and rate limits (reads, writes, and delete limits) on the Usage page. Some usage data affects monthly costs ([pricing vectors](/influxdb/cloud/account-management/pricing-plans/#pricing-vectors)) and other usage data (for example, delete limits), does not affect pricing. For more information, see the [InfluxDB Cloud limits and adjustable quotas](/influxdb/cloud/account-management/limits/).

To view your {{< product-name >}} data usage, do the following:

1. Click on your email address in the upper left hand corner.
2. Select **Usage** from the dropdown menu.
3. Select a time range to review data usage (by default, `Past 24h`), and then select one of the following:

   - **Data In:** Total data in MB written to your {{< product-name "short" >}} instance. Data in and write requests do not count towards your query count.
   - **Query Count:** Total number of individual query operations, which include queries, tasks (alerts, notifications) and Data Explorer activity. Note, a script that includes multiple requests (for example, has multiple `from()...` lines) counts as one query.
   - **Storage:** Total disk usage in gigabytes.
   - **Data Out:** Total data in MB sent as responses to queries from your {{< product-name "short" >}} instance.

A line graph displays usage for the selected vector for the specified time period.
