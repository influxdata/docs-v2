---
title: InfluxDB Cloud limits
description: >
  InfluxDB Cloud has adjustable account limits and hard system limits.
weight: 110
menu:
  influxdb_cloud:
    parent: Account management
    name: Limits
products: [cloud]
---

InfluxDB Cloud has adjustable organization limits and hard system limits:

- [Adjustable limits](#adjustable-limits)
- [System limits](#system-limits)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Adjustable limits

All organizations in InfluxDB Cloud have limits. These limits vary 

### Calculation and enforcement

Rate limits are accured against a five minute window.

### Limits for Free accounts

#### Rate limits

Data queried: 300MB every 5 minutes
Write: 5.1MB every 5 minutes
<!-- Delete: ? -->

#### Static limits

Max series cardinality: 10,000 series
Max buckets: 2
Max retention duration: 30 days
Max notification rules: 2
Max dashboards: 5
Max tasks: 5
Max checks: 2
Allowed notification rules and endpoints: http, pagerduty

{{% note %}}
To write historical data older than 30 days or retain data for more than 30 days, upgrade to the Cloud [Usage-Based plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan).
{{% /note %}}

_To raise rate limits on a Free account, [upgrade to a Usage-based Plan](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan) or [reach out](https://www.influxdata.com/contact-sales/)._

### Limits for Usage-based accounts

#### Rate limits

Read: 3 GB every 5 minutes
Write: 3 GB every 5 minutes
<!-- Delete: ? -->

#### Static limits

Max series cardinality: 1,000,000 series
Unlimited buckets, retention duration, notification rules, dashboards, tasks, and checks.
All notification rules and endpoints are allowed

_To raise rate limits on a Usage-based account, please [reach out to our Support team](https://support.influxdata.com/s/)._

## System limits

InfluxDB Cloud has limits which are inherent restrictions of the system. These hard limits are typically dictated by the capabilities of the underlying InfluxDB Cloud infrastructure.

Max write request batch size: 50MB (defined via `Content-Type` header)



-------

## Exceeded rate limits

If you exceed your [plan's data limits](/influxdb/cloud/account-management/pricing-plans/), {{< cloud-name >}} UI displays a notification message, and the following occurs:

- When **write or read requests or series cardinality exceed** the specified limit within a five-minute window, the request is rejected and the following events appears under **Limit Events** on the Usage page as applicable: `event_type_limited_query` or `event_type_limited_write` or `event_type_limited_cardinality`

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
