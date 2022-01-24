---
title: InfluxDB Cloud limits and adjustable quotas
description: >
  InfluxDB Cloud has adjustable account limits and hard system limits.
weight: 110
menu:
  influxdb_cloud:
    parent: Account management
    name: Adjustable quotas and limits
products: [cloud]
---

InfluxDB Cloud has adjustable account quotas per organization and hard global system limits. Review adjustable service quotas and global limits to plan for your bandwidth needs:

- [Adjustable service quotas](#account-limits)
- [Global limits](#global-limits)
- [Limit errors](#limit-errors)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Adjustable service quotas

To reduce the chance of unexpected charges and protect the service for all users, InfluxDB Cloud has adjustable service quotas applied per account.

_To request higher service quotas, reach out to [InfluxData Support](https://support.influxdata.com/)._

### Free Plan

{{% warn %}}
Data-in (writes) and queries (reads) are accrued against a five-minute window. Quotas are applied to uncompressed payloads.
{{% /warn %}}
<!-- Include something about how this is calculated. -->

- **Data-in**:
   - 5 MB per 5 minutes (normalized [line protocol](/influxdb/cloud/reference/syntax/line-protocol/))
   - Maximum payload 50 MB (HTTP)
- **Read**: 300 MB per 5 minutes (response bytes)
- **Cardinality**: 10k series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))
- **Available resources**:
  - 2 buckets (excluding `_monitoring` and `_tasks` buckets)
  - 5 dashboards
  - 5 tasks
- **Alerts**:
    - 2 checks
    - 2 notification rules
    - Unlimited Slack notification endpoints
- **Storage**: 30 days of data retention (see [retention period](/influxdb/cloud/reference/glossary/#retention-period))

{{% note %}}
Set your retention period to unlimited or up to 1 year by [updating a bucket’s retention period in the InfluxDB UI](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-period-in-the-influxdb-ui), or [set a custom retention period](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-period) using the [`influx` CLI](influxdb/cloud/reference/cli/influx/).
{{% /note %}}

  {{% note %}}
To write historical data older than 30 days, retain data for more than 30 days, or increase rate limits, upgrade to the Cloud [Usage-Based Plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan).
  {{% /note %}}

### Usage-Based Plan

- **Data-in**:
   - 3 GB per 5 minutes
   - Maximum payload 50 MB (HTTP)
   - 250 MB uncompressed
- **Read**: 3 GB data per 5 minutes (response bytes)
- **Cardinality**: 1M series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))
- **Unlimited resources**
  - dashboards
  - tasks
  - buckets
  - users
- **Alerts**
    - checks
    - notification rules
    - notification endpoints:
      - PagerDuty, Slack, and HTTP available in UI
      - [Additional endpoints](/flux/v0.x/tags/notification-endpoints/) available in Flux

## Global limits

InfluxDB Cloud global system limits cannot be adjusted and apply to all accounts.
These hard limits are typically dictated by the capabilities of the underlying InfluxDB Cloud infrastructure.
Limits include:

- Write request limits:
  - 50 MB maximum request batch size (defined in the `Content-Type` header)
  - 250 MB maximum decompressed request batch size
    <!-- http status code 413 with message {"code":"request too large","message":"cannot read data: points batch is too large"} -->
- Delete request limit: 300 every 5 minutes

## Limit errors

If you exceed your plan's limits, the following errors occur.

### Errors in InfluxDB Cloud UI

{{< cloud-name >}} UI displays a notification message in the UI.

- When **write requests**, **read requests**, or **series cardinality** exceeds the specified limit within a five-minute window, the request is rejected and the following events appears under **Limit Events** on the Usage page as applicable: `event_type_limited_query` or `event_type_limited_write` or `event_type_limited_cardinality`

- When **delete requests exceed** the specified limit within a five-minute window, the request is rejected and `event_type_limited_delete_rate` appears under **Limit Events** on the Usage page.
  
  {{% note %}}
**Tip:**
Combine predicate expressions (if possible) into a single request. InfluxDB limits delete requests by number of requests (not points in request).
{{% /note %}}

### Errors in InfluxDB API response

The InfluxDB API returns the following HTTP responses when requests exceed specified rate limits or payload limits. Limits for write requests (Data In) and query requests (Reads) are applied within a five minute window.

| Request limits      | Error response      |
| :-------------------| :------------------ |
| If a **read** or **write** request exceeds your [plan's rate limits](/influxdb/cloud/account-management/limits/#rate-limits) or if a **delete** request exceeds the global limit | *HTTP 429 “Too Many Requests” <br> Retry-After: xxx (seconds to wait before retrying the request)*
| If a **write** request exceeds the global maximum payload size (**50 MB** or **250 MB *decompressed***)  | *HTTP 413 “Payload Too Large” <br> {"code":"request too large","message":"cannot read data: points batch is too large"}* |

| Cardinality limits  | Error response     |
| :-------------------| :------------------|
| When **series cardinality** exceeds your plan’s limit | *HTTP 503 “Series cardinality exceeds your plan's limit”* |
