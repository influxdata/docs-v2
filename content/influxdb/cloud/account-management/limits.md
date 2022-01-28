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

InfluxDB Cloud has adjustable account quotas per organization and hard global system limits.

{{% warn %}}
All __rates__ (data-in (writes), queries (reads), and deletes) are accrued within a fixed five-minute window. Once a rate is exceeded an error response is returned until the current five-minute window resets.
{{% /warn %}}

Review adjustable service quotas and global limits to plan for your bandwidth needs:

- [Adjustable service quotas](#adjustable-service-quotas)
- [Global limits](#global-limits)
- [UI Error Messages](#ui-error-messages)
<!-- - [API Error Responses](#api-error-responses) -->

## Adjustable service quotas

To reduce the chance of unexpected charges and protect the service for all users, InfluxDB Cloud has adjustable service quotas applied per account.

_To request higher service quotas, reach out to [InfluxData Support](https://support.influxdata.com/)._

### Free Plan

- **Data-in**: Rate of 5 MB per 5 minutes (average of 17 kb/s)
  - Uncompressed bytes of normalized [line protocol](/influxdb/cloud/reference/syntax/line-protocol/)
- **Read**: Rate of 300 MB per 5 minutes (average of 1000 kb/s)
  - Bytes (uncompressed or compressed) in HTTP in response payload
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

- **Data-in**: Rate of 3 GB per 5 minutes
  - Uncompressed bytes of normalized [line protocol](/influxdb/cloud/reference/syntax/line-protocol/)
- **Read**: Rate of 3 GB data per 5 minutes
  - Bytes in HTTP in response payload
- **Cardinality**: 1M series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))
- **Unlimited resources**
  - dashboards
  - tasks
  - buckets
  - users
- **Alerts**
  - Unlimited checks
  - Unlimited notification rules
  - Unlimited notification endpoints for [all endpoints](/flux/v0.x/tags/notification-endpoints/)

## Global limits

InfluxDB Cloud global system limits cannot be adjusted and apply to all accounts.
These hard limits are typically dictated by the capabilities of the underlying InfluxDB Cloud infrastructure.
Limits include:

- Write request limits:
  - 50 MB maximum HTTP request batch size (compressed or uncompressed--defined in the `Content-Type` header)
  - 250 MB maximum HTTP request batch size after decompression
- Query processing time: 90 seconds
- Task processing time: 150 seconds
- Delete request limit: Rate of 300 every 5 minutes
  {{% note %}}
**Tip:**
Combine predicate expressions (if possible) into a single request. InfluxDB limits delete requests by number of requests (not points in request).
{{% /note %}}

## UI Error Messages

The {{< cloud-name >}} UI displays a notification message when service quotas or limits are exceeded. The error messages will coorespond with the relevant [API error responses](#api-error-responses).

Errors can also be viewed in the [Usage page](/influxdb/cloud/account-management/data-usage) under **Limit Events**, e.g. `event_type_limited_query`, `event_type_limited_write`,`event_type_limited_cardinality`, or `event_type_limited_delete_rate`.

<!-- Put in a screenshot of the error message in UI -->

<!-- 
## API Error Responses

The following API error responses occur when your plan's service quotas or limits are exceeded.
-->
<!-- will add these to API docs and inlude a link -->
<!-- Add in link to API doc on error responses -->

<!-- 
| HTTP Response Code | HTTP Error Message | Service quota or limit description |
| :-------------------| :------------------ |  :------------------ |
| 503 - service unavailable | Series cardinality exceeds your plan's limit | Service quota:  |
| 413 - request too large | cannot read data: points batch is too large | Limit: 250 MB maximum decompressed request batch size exceeded |
| If a **read** or **write** request exceeds your [plan's rate limits](/influxdb/cloud/account-management/limits/#rate-limits) or if a **delete** request exceeds the global limit | *HTTP 429 “Too Many Requests” <br> Retry-After: xxx (seconds to wait before retrying the request)*
| If a **write** request exceeds the global maximum payload size (**50 MB** or **250 MB *decompressed***)  | *HTTP 413 “Payload Too Large” <br> {"code":"request too large","message":"cannot read data: points batch is too large"}* |
-->
