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

InfluxDB Cloud has adjustable account limits per organization and hard global system limits. Review the following InfluxDB Cloud limits and errors to plan for your bandwidth needs:

- [Account limits](#account-limits)
- [Global limits](#global-limits)
- [Limit errors](#limit-errors)

<!--To estimate your projected usage costs, use the [InfluxDB Cloud pricing calculator](/influxdb/cloud/account-management/pricing-calculator/). -->

## Account limits

InfluxDB Cloud has adjustable limits applied per-account to reduce the chance of unexpected charges and protect the service for all users.

_To request higher limits, reach out to [InfluxData Support](https://support.influxdata.com/)._

### Rate limits

{{% warn %}}
Rate limits are accrued against a five-minute window.
{{% /warn %}}
<!-- Include something about how the rate limit is calculated. -->

#### Free Plan rate limits

- Read: 300 MB data every 5 minutes
- Write: 5.1 MB data every 5 minutes

#### Usage-Based Plan rate limits

- Read: 3 GB data every 5 minutes
- Write: 3 GB data every 5 minutes

### Other limits

Other limits include all adjustable limits other than rate limits.

#### Free Plan limits

- Maximum of 10,000 series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))
- Available resources:
  - 2 buckets
  - 2 notification rules
  - 5 dashboards
  - 5 tasks
  - 2 checks
  - `http` and `pagerduty` notification endpoints
- 30 days of data retention (see [retention period](/influxdb/cloud/reference/glossary/#retention-period))

{{% note %}}
Set your retention period to unlimited or up to 1 year by [updating a bucket’s retention period in the InfluxDB UI](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-period-in-the-influxdb-ui), or [set a custom retention period](/influxdb/cloud/organizations/buckets/update-bucket/#update-a-buckets-retention-period) using the [`influx` CLI](influxdb/cloud/reference/cli/influx/).
{{% /note %}}

  {{% note %}}
To write historical data older than 30 days, retain data for more than 30 days, or increase rate limits, upgrade to the Cloud [Usage-Based Plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan).
  {{% /note %}}

#### Usage-Based Plan limits

- Maximum of 1,000,000 series (see [cardinality](/influxdb/cloud/reference/glossary/#series-cardinality))

### Unlimited resources

  - Dashboards
  - Tasks
  - Buckets
  - Users
  - Checks
  - Notification rules
  - PagerDuty, Slack, and HTTP notification endpoints

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

<!-- Make this section into a table. -->

The InfluxDB API returns the following HTTP responses when requests exceed specified rate limits or payload limits.

#### Request limits

When a request exceeds your plan's write requests (Data In) or query requests (Reads) within a five minute window, the InfluxDB API returns the following responses:

- When a **read** or **write** or **delete** request exceeds request limit:

  ```
  HTTP 429 “Too Many Requests”
  Retry-After: xxx (seconds to wait before retrying the request)
  ```

- When a **write** request maximum payload (or decompressed payload) exceeds limits:

  ```
  HTTP 413 “Payload Too Large”
  {"code":"request too large","message":"cannot read data: points batch is too large"}
  ```

#### Cardinality limits

- When **series cardinality exceeds** your plan's limit:

  ```
  HTTP 503 “Series cardinality exceeds your plan's limit”
  ```
