---
title: View InfluxDB Cloud data usage
list_title: View data usage
description: >
  View your InfluxDB Cloud data usage and rate limit notifications.
weight: 103
aliases:
  - /influxdb/v2.0/account-management/data-usage
  - /influxdb/v2.0/cloud/account-management/data-usage
menu:
  influxdb_cloud:
    parent: Account management
    name: View data usage
products: [cloud]
---

View the statistics of your data usage and rate limits (reads, writes, and delete limits) on the Usage page. Some usage data affects monthly costs ([pricing vectors](/influxdb/cloud/account-management/pricing-plans/#pricing-vectors)) and other usage data (for example, delete limits), does not affect pricing. For more information about limits, see the [InfluxDB Cloud limits](/influxdb/cloud/account-management/limits/).

To view your {{< cloud-name >}} data usage, do the following:

1. Click the **user avatar** on the left-side navigation.
2. Select **Usage**.
3. Select a time range to review data usage (by default, `Past 24h`), and then select one of the following:

   - **Data In:** Total data in MB written to your {{< cloud-name "short" >}} instance.
   - **Query Count:** Total number of individual query operations, which include queries, tasks (alerts, notifications) and Data Explorer activity.
   - **Storage:** Total disk usage in gigabytes.
   - **Data Out:** Total data in MB sent as responses to queries from your {{< cloud-name "short" >}} instance.

A line graph displays usage for the selected vector for the specified time period.

<!-- Link to limits page, i.e. if you have received and error about rate limits exceeded and want more info, go here. -->
