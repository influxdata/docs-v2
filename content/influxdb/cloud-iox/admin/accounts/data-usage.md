---
title: View InfluxDB Cloud (IOx) data usage
list_title: View data usage
description: >
  View your InfluxDB Cloud (IOx) data usage and rate limit notifications.
weight: 103
menu:
  influxdb_cloud_iox:
    parent: Manage accounts
    name: View data usage
related:
  - /flux/v0.x/stdlib/experimental/usage/from/
  - /flux/v0.x/stdlib/experimental/usage/limits/
---

View the statistics of your data usage and rate limits (reads, writes, and delete limits) on the InfluxDB Cloud UI **Usage** page. Some usage data affects monthly costs and other usage data (for example, delete limits), does not affect pricing. For more information, see [limits and adjustable quotas](/influxdb/cloud-iox/admin/accounts/limits/).

To view your {{< cloud-name >}} data usage, do the following:

1. Click on your organization in the header near the top of the page.
2. Select **Usage** from the dropdown menu.
3. Select a time range to review data usage (by default, `Past 24h`), and then select one of the following:

   - **Data In:** Total data in MB written to your {{< cloud-name "short" >}} instance. Data in and write requests do not count towards your query count.
   - **Query Count:** Total number of individual query operations, which include queries, tasks (alerts, notifications) and Data Explorer activity. Note, a script that includes multiple requests (for example, has multiple `from()...` lines) counts as one query.
   - **Storage:** Total disk usage in gigabytes.
   - **Data Out:** Total data in MB sent as responses to queries from your {{< cloud-name "short" >}} instance.

A line graph displays usage for the selected vector for the specified time period.
