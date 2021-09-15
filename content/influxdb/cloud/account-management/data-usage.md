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

View the statistics of your data usage and rate limits (reads, writes, and delete limits) on the Usage page. Some usage data affects monthly costs (pricing vectors) and other usage data, including delete limits, does not affect pricing. For more information about costs and limits, see the [pricing plans](/influxdb/cloud/account-management/pricing-plans/).

To view your {{< cloud-name >}} data usage, do the following:

1. Click the **user avatar** on the left-side navigation.
2. Select **Usage**.
3. Select a time range to review data usage (by default, `Past 24h`), and then select one of the following:

   - **Data In:** Total data in MB written to your {{< cloud-name "short" >}} instance.
   - **Query Count:** Total number of individual query operations, which include queries, tasks (alerts, notifications) and Data Explorer activity.
   - **Storage:** Total disk usage in gigabytes.
   - **Data Out:** Total data in MB sent as responses to queries from your {{< cloud-name "short" >}} instance.

A line graph displays usage for the selected vector for the specified time period.

## Exceeded rate limits

If you exceed your [plan's data limits](/influxdb/cloud/account-management/pricing-plans/), {{< cloud-name >}} UI displays a notification message, and the following occurs:

- When **write or read requests or series cardinality exceed** the specified limit within a five-minute window, the request is rejected and the following events appears under **Limit Events** on the Usage page as applicable: `event_type_limited_query` or `event_type_limited_write` or `event_type_limited_cardinality`

  _To raise these rate limits, [upgrade to a Usage-based Plan](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan)._

- When **delete requests exceed** the specified limit within a five-minute window, the request is rejected and `event_type_limited_delete_rate` appears under **Limit Events** on the Usage page.
  {{% note %}}
**Tip:**
Combine predicate expressions (if possible) into a single request. InfluxDB rate limits per number of requests (not points in request).
{{% /note %}}

### InfluxDB API: HTTP rate limit responses

The InfluxDB API returns the following responses:

- When a **read or write or delete request exceeds** limits:

  ```
  HTTP 429 “Too Many Requests”
  Retry-After: xxx (seconds to wait before retrying the request)
  ```

- When **series cardinality exceeds** your plan's limit:

  ```
  HTTP 503 “Series cardinality exceeds your plan's limit”
  ```
