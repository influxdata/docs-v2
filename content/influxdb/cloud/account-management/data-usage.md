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

To view your {{< cloud-name >}} data usage, click the **user avatar** in the top
right corner of your {{< cloud-name "short" >}} user interface (UI) and select **Usage**.

Find data usage information for the time frame specified in the drop-down at the top of the Usage page.

- **Data In:** Total data in MB written to your {{< cloud-name "short" >}} instance.
- **Storage:** Total disk usage in gigabytes.
- **Query Count:** Total number of individual query operations, which include queries, tasks (alerts, notifications) and Data Explorer activity.
- **Data Out:** Total data in MB sent as responses to queries from your {{< cloud-name "short" >}} instance.
- **Usage over the specified time period:** A line graph that visualizes usage over the specified time period.
- **Rate Limits over the specified time period:** A list of rate limit events over the specified time period.

{{< img-hd src="/img/influxdb/2-0-cloud-usage.png" />}}

## Exceeded rate limits

If you exceed your [plan's rate limits](/influxdb/cloud/account-management/pricing-plans/), {{< cloud-name >}} provides a notification in the {{< cloud-name "short" >}} user interface (UI) and adds a rate limit event to your **Usage** page for review. InfluxDB Cloud plans include the following rate limits:

- If **write or read requests exceed** the specified limit within a five-minute window, InfluxDB retries the request after that five-minute interval. The UI displays `event_type_limited_query` or `event_type_limited_write` as fields.
- If the **series cardinality exceeds** the limit, requests are rejected and **not** queued. The UI displays `event_type_limited_cardinality` as a field.

_To remove rate limits, [upgrade to a Usage-based Plan](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan)._

### InfluxDB API: HTTP rate limit responses

The InfluxDB API returns the following responses:

- When a **read or write request exceeds** your plan's limit:

  ```
  HTTP 429 “Too Many Requests”
  Retry-After: xxx (seconds to wait before retrying the request)
  ```

- When **series cardinality exceeds** your plan's limit:

  ```
  HTTP 503 “Series cardinality exceeds your plan's limit”
  ```
