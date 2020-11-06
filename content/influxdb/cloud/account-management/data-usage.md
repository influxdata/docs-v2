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
- **Data Out:** Total data in MB sent as responses to queries from your {{< cloud-name "short" >}} instance.
- **Query Count:** Total number of individual query operations, which include queries, tasks (alerts, notifications) and Data Explorer activity.
- **Storage Usage:** Total disk usage in gigabytes.
- **API Request Count:** The total number of query and write API requests received during the specified time frame.
- **Usage over the specified time period:** A line graph that visualizes usage over the specified time period.
- **Rate Limits over the specified time period:** A list of rate limit events over the specified time period.

{{< img-hd src="/img/influxdb/2-0-cloud-usage.png" />}}

## Exceeded rate limits

If you exceed your plan's [rate limits](/influxdb/cloud/account-management/pricing-plans/), {{< cloud-name >}}
will provide a notification in the {{< cloud-name "short" >}} user interface (UI)
and add a rate limit event to your **Usage** page for review.

All rate-limited requests are rejected; including both read and write requests.
_Rate-limited requests are **not** queued._

_To remove rate limits, [upgrade to a Usage-based Plan](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan)._

### Rate-limited HTTP response code
When a request exceeds your plan's rate limit, the InfluxDB API returns the following response:

```
HTTP 429 “Too Many Requests”
Retry-After: xxx (seconds to wait before retrying the request)
```
