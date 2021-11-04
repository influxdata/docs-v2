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

- [Account limits](#account-limits)
- [Global limits](#global-limits)
- [Limit errors](#limit-errors)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Account limits

InfluxDB Cloud has adjustable limits applied per-account to reduce the chance of unexpected charges and protect the service for all users.

_To request higher limits, reach out to [InfluxData Support](https://support.influxdata.com/)._

### Rate limits

Rate limits are acrued against a five minute window.
<!-- Inclue something about how the rate limit is calculated. -->

Usage-Based Plan rate limits

- Read: 3 GB every 5 minutes
- Write: 3 GB every 5 minutes
<!-- - Delete: ? -->

Free Plan rate limits

- Data queried: 300MB every 5 minutes
- Write: 5.1MB every 5 minutes

### Other limits

Usage-Based Plan limits

- Maximum of 1,000,000 series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))

Free Plan limits

- Maximum of 10,000 series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))
- Allowed resources
  - 2 buckets
  - 2 notification rules
  - 5 dashboards
  - 5 tasks
  - 2 checks
  - `http` and `pagerduty` notification endpoints
- 30 days of data retention (see [retention period](/influxdb/cloud/reference/glossary/#retention-period))
  - {{% note %}}
    To write historical data older than 30 days, retain data for more than 30 days, or increase rate limits, upgrade to the Cloud [Usage-Based Plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan).
    {{% /note %}

## Global limits

InfluxDB Cloud also has global system limits that cannot be adjusted and apply to all accounts.
These hard limits are typically dictated by the capabilities of the underlying InfluxDB Cloud infrastructure.

- Write/ingest request limits
  - Maximum request batch size: 50MB (defined via `Content-Type` header)
  - Maximum decompressed request batch size: 250MB
    <!-- http status code 413 with message {"code":"request too large","message":"cannot read data: points batch is too large"} -->

## Limit errors

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
