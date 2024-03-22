---
title: InfluxDB Cloud Serverless limits and adjustable quotas
list_title: Limits and adjustable quotas
description: >
  InfluxDB Cloud Serverless has adjustable service quotas and global (non-adjustable) system limits.
weight: 110
menu:
  influxdb_cloud_serverless:
    parent: Manage billing
    name: Adjustable quotas and limits
related:
  - /flux/v0.x/stdlib/experimental/usage/from/
  - /flux/v0.x/stdlib/experimental/usage/limits/
  - /influxdb/cloud-serverless/write-data/best-practices/
alt_links:
  cloud: /influxdb/cloud/account-management/limits/
aliases:
  - /influxdb/cloud-serverless/admin/accounts/limits/
  - /influxdb/cloud-serverless/account-management/limits/
  - /influxdb/cloud-serverless/reference/internals/storage-limits/
---

InfluxDB Cloud Serverless applies (non-adjustable) global system limits and
adjustable service quotas on a per organization basis.

{{% warn %}}
All __rates__ (data-in (writes), and queries (reads)) are accrued within a fixed five-minute window.
Once a rate is exceeded, an error response is returned until the current five-minute window resets.
{{% /warn %}}

Review adjustable service quotas and global limits to plan for your bandwidth needs:

<!-- TOC -->

- [Adjustable service quotas](#adjustable-service-quotas)
  - [Storage-level](#storage-level)
    - [Terminology](#terminology)
    - [Storage-level limits](#storage-level-limits)
  - [Free Plan](#free-plan)
  - [Usage-Based Plan](#usage-based-plan)
- [Global limits](#global-limits)
- [Error messages when exceeding quotas or limits](#error-messages-when-exceeding-quotas-or-limits)
  - [Storage level Errors](#storage-level-errors)
    - [Maximum number of columns reached](#maximum-number-of-columns-reached)
      - [Potential solutions](#potential-solutions)
    - [Maximum number of tables reached](#maximum-number-of-tables-reached)
  - [Error messages in the UI](#error-messages-in-the-ui)
  - [API error response messages](#api-error-response-messages)

<!-- /TOC -->
## Adjustable service quotas

To reduce the chance of unexpected charges and protect the service for all users,
InfluxDB Cloud Serverless has adjustable service quotas applied per account.

### Storage-level

The InfluxDB v3 storage engine enforces limits on the storage level that apply
to all accounts (Free Plan and Usage-Based Plan).

- [Terminology](#terminology)
- [Service-level limits](#limits)

#### Terminology

- **namespace**: organization+bucket
- **table**: [measurement](/influxdb/cloud-serverless/reference/glossary/#measurement)
- **column**: time, tags and fields are structured as columns

#### Storage-level limits

The v3 storage engine enforces the following storage-level limits:

- **Maximum number of tables per database**: 500
- **Maximum number of columns per table**: 200

{{% note %}}
Storage-level limits apply to Free Plan and Usage-Based Plan accounts.
If you need higher storage-level limits, [contact InfluxData Sales](https://www.influxdata.com/contact-sales/).
{{% /note %}}

### Free Plan

- **Data-in**: Rate of 5 MB per 5 minutes (average of 17 kb/s)
  - Uncompressed bytes of normalized [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/)
- **Read**: Rate of 300 MB per 5 minutes (average of 1000 kb/s)
  - Bytes in HTTP in response payload
- **Available resources**:
  - 2 buckets (excluding `_monitoring` and `_tasks` buckets)
- **Storage**:
  - [Storage-level limits](#storage-level-limits)
  - 30 days of data retention (see [retention period](/influxdb/cloud-serverless/reference/glossary/#retention-period))

{{% note %}}
To write historical data older than 30 days, retain data for more than 30 days, increase rate limits, or create additional organizations, upgrade to the Cloud [Usage-Based Plan](/influxdb/cloud-serverless/admin/billing/pricing-plans/#usage-based-plan).
{{% /note %}}

### Usage-Based Plan

- **Data-in**: Rate of 300 MB per 5 minutes
  - Uncompressed bytes of normalized [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/)
- **Read**: Rate of 3 GB data per 5 minutes
  - Bytes in HTTP in response payload
- **Unlimited resources**
  - buckets
  - users
- **Storage**:
  - [Storage-level limits](#storage-level-limits)
  - Set your retention period to unlimited or up to 1 year by
  [updating a bucket’s retention period in the InfluxDB UI](/influxdb/cloud-serverless/admin/buckets/update-bucket/#update-a-buckets-retention-period-in-the-influxdb-ui),
  or set a custom retention period using the [`influx bucket update command`](/influxdb/cloud-serverless/reference/cli/influx/bucket/update/)
  with the [`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/).

## Global limits

InfluxDB Cloud Serverless applies global (non-adjustable) system limits to all accounts,
which protects the InfluxDB Cloud Serverless infrastructure for all users.
As the service continues to evolve, we'll continue to review these global limits
and adjust them as appropriate.

Limits include:

- **Write request limits**:
  - 50 MB maximum HTTP request batch size (compressed or uncompressed--defined in the `Content-Encoding` header)
  - 250 MB maximum HTTP request batch size after decompression
- **Write partition limit**:
  - Write to 5000 distinct partitions per bucket every 15 minutes
    (data is partitioned by day)
- **Query processing time**: 90 seconds
- **Total query time**: 1500 seconds of _total_ query time every 30 seconds
- **Task processing time**: 150 seconds
- **Total task time**: 1500 seconds of _total_ task time every 30 seconds
<!-- - **Delete request limit**: Rate of 300 every 5 minutes -->
<!--   
    {{% note %}}
**Tip:**
Combine delete predicate expressions (if possible) into a single request. InfluxDB limits delete requests by number of requests (not points per request).
    {{% /note %}} -->

## Error messages when exceeding quotas or limits

### Storage level Errors

#### Maximum number of columns reached

```
couldn't create columns in table `table_name`; table contains
<N> existing columns, applying this write would result
in <N+> columns, limit is 200
```

This error is returned for any write request that would exceed the maximum
number of columns allowed in a table.

##### Potential solutions

- Consider storing new fields in a new [measurement](/influxdb/cloud-serverless/reference/glossary/#measurement) (not to exceed the [maximum number of tables](#maximum-number-of-tables-reached)).
- Review [InfluxDB schema design recommendations](/influxdb/cloud-serverless/write-data/best-practices/schema-design/).
- Customers with an annual or support contract can contact [InfluxData Support](https://support.influxdata.com) to request a review of their database schema.

#### Maximum number of tables reached

```
dml handler error: service limit reached: couldn't create new table; namespace contains <N> existing
tables, applying this write would result in <N+> columns, limit is 500
```

This error is returned for any write request that would exceed the maximum
number of tables (measurements) allowed in a namespace.

### Error messages in the UI

The {{< product-name >}} UI displays a notification message when service quotas or limits are exceeded.
The error messages correspond with the relevant [API error response messages](#api-error-response-messages).

Errors can also be viewed in the [Usage page](/influxdb/cloud-serverless/admin/billing/data-usage/)
under **Limit Events**--for example: `event_type_limited_query`, `event_type_limited_write`,
or `event_type_limited_delete_rate`.

### API error response messages

The following API error responses occur when your plan's service quotas are exceeded.

| HTTP response code              | Error message                               | Description  |
| :-----------------------------  | :-----------------------------------------  | :----------- |
| `HTTP 413 "Request Too Large"`  | cannot read data: points in batch is too large | If a **write** request exceeds the maximum [global limit](#global-limits) |  
| `HTTP 429 "Too Many Requests"`  | Retry-After: xxx (seconds to wait before retrying the request) | If a **read** or **write** request exceeds your plan's [adjustable service quotas](#adjustable-service-quotas) or if a **delete** request exceeds the maximum [global limit](#global-limits) |
