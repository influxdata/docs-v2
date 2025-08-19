---
title: View InfluxDB Cloud Serverless data usage
list_title: View data usage
description: >
  View your InfluxDB Cloud Serverless data usage and rate limit notifications.
weight: 103
menu:
  influxdb3_cloud_serverless:
    parent: Manage billing
    name: View data usage
related:
  - /flux/v0/stdlib/experimental/usage/from/
  - /flux/v0/stdlib/experimental/usage/limits/
alt_links:
  cloud: /influxdb/cloud/account-management/data-usage/
aliases:
  - /influxdb3/cloud-serverless/admin/accounts/data-usage/
---

View the statistics of your data usage and rate limits (reads and writes) on the
InfluxDB Cloud Serverless UI **Usage** page.
For more information, see [limits and adjustable quotas](/influxdb3/cloud-serverless/admin/billing/limits/).

To view your {{< product-name >}} data usage, do the following:

1.  Click on your organization in the header near the top of the page.
2.  Select **Usage** from the dropdown menu.
3.  Select a time range to review data usage (by default, `Past 24h`), and then select one of the following:

    - **Data In:** Total data in MB written to your {{< product-name "short" >}} instance.
      Data in and write requests do not count towards your query count.
    - **Query Count:** Total number of individual query operations, which include
      queries from external clients.
    - **Storage:** Total disk usage in gigabytes.
    - **Data Out:** Total data in MB sent as responses to queries from your
      InfluxDB Cloud Serverless instance.

A line graph displays usage for the selected vector for the specified time period.
