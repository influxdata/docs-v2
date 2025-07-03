---
title: InfluxDB Cloud Serverless limits and adjustable quotas
list_title: Limits and adjustable quotas
description: >
  InfluxDB Cloud Serverless has adjustable service quotas and global (non-adjustable) system limits.
weight: 110
menu:
  influxdb3_cloud_serverless:
    parent: Manage billing
    name: Adjustable quotas and limits
related:
  - /flux/v0/stdlib/experimental/usage/from/
  - /flux/v0/stdlib/experimental/usage/limits/
  - /influxdb3/cloud-serverless/write-data/best-practices/
alt_links:
  cloud: /influxdb/cloud/account-management/limits/
aliases:
  - /influxdb3/cloud-serverless/admin/accounts/limits/
  - /influxdb3/cloud-serverless/account-management/limits/
  - /influxdb3/cloud-serverless/reference/internals/storage-limits/
---

InfluxDB Cloud Serverless applies (non-adjustable) global system limits and
adjustable service quotas on a per organization basis.

> [!Warning]
> All __rates__ (data-in (writes), and queries (reads)) are accrued within a fixed five-minute window.
> Once a rate is exceeded, an error response is returned until the current five-minute window resets.

Review adjustable service quotas and global limits to plan for your bandwidth needs:

- [Adjustable service quotas](#adjustable-service-quotas)
  - [Storage-level](#storage-level)
  - [Free Plan](#free-plan)
  - [Usage-Based Plan](#usage-based-plan)
- [Global limits](#global-limits)
- [Error messages when exceeding quotas or limits](#error-messages-when-exceeding-quotas-or-limits)
  - [Storage level Errors](#storage-level-errors)
  - [Error messages in the UI](#error-messages-in-the-ui)
  - [API error response messages](#api-error-response-messages)
  - [Read (query) limit errors](#read-query-limit-errors)

## Adjustable service quotas

To reduce the chance of unexpected charges and protect the service for all users,
InfluxDB Cloud Serverless has adjustable service quotas applied per account.

### Storage-level

The InfluxDB 3 storage engine enforces limits on the storage level that apply
to all accounts (Free Plan and Usage-Based Plan).

- [Terminology](#terminology)
- [Storage-level limits](#storage-level-limits)

#### Terminology

- **namespace**: organization+bucket
- **table**: [measurement](/influxdb3/cloud-serverless/reference/glossary/#measurement)
- **column**: time, tags and fields are structured as columns

#### Storage-level limits

The v3 storage engine enforces the following storage-level limits:

- **Maximum number of tables per database**: 500
- **Maximum number of columns per table**: 200

> [!Note]
> Storage-level limits apply to Free Plan and Usage-Based Plan accounts.
> If you need higher storage-level limits, [contact InfluxData Sales](https://www.influxdata.com/contact-sales/).

### Free Plan

- **Data-in**: Rate of 5 MB per 5 minutes (average of 17 kb/s)
  - Uncompressed bytes of normalized [line protocol](/influxdb3/cloud-serverless/reference/syntax/line-protocol/)
- **Read**:
  - **HTTP response payload rate**: 300 MB data per 5 minutes (average of 1000 kb/s)
  - **Partitions per query**: 500
  - **Parquet files per query**: 1000
- **Available resources**:
  - 2 buckets (excluding `_monitoring` and `_tasks` buckets)
- **Storage**:
  - [Storage-level limits](#storage-level-limits)
  - 30 days of data retention (see [retention period](/influxdb3/cloud-serverless/reference/glossary/#retention-period))

> [!Note]
> To write historical data older than 30 days, retain data for more than 30 days, increase rate limits, or create additional organizations, upgrade to the Cloud [Usage-Based Plan](/influxdb3/cloud-serverless/admin/billing/pricing-plans/#usage-based-plan).

### Usage-Based Plan

- **Data-in**: Rate of 300 MB per 5 minutes
  - Uncompressed bytes of normalized [line protocol](/influxdb3/cloud-serverless/reference/syntax/line-protocol/)
- **Read**:
  - **HTTP response payload rate**: Rate of 3 GB data per 5 minutes
  - **Partitions per query**: 2000
  - **Parquet files per query**: 10000
- **Unlimited resources**
  - buckets
  - users
- **Storage**:
  - [Storage-level limits](#storage-level-limits)
  - Set your retention period to unlimited or up to 1 year by
  [updating a bucket’s retention period in the InfluxDB UI](/influxdb3/cloud-serverless/admin/buckets/update-bucket/#update-a-buckets-retention-period-in-the-influxdb-ui),
  or set a custom retention period using the [`influx bucket update command`](/influxdb3/cloud-serverless/reference/cli/influx/bucket/update/)
  with the [`influx` CLI](/influxdb3/cloud-serverless/reference/cli/influx/).

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
    > [!Note]
    > **Tip:**
    > Combine delete predicate expressions (if possible) into a single request. InfluxDB limits delete requests by number of requests (not points per request).
    -->

## Error messages when exceeding quotas or limits

### Storage level Errors

#### Maximum number of columns reached

```http
couldn't create columns in table `table_name`; table contains
<N> existing columns, applying this write would result
in <N+> columns, limit is 200
```

This error is returned for any write request that would exceed the maximum
number of columns allowed in a table.

##### Potential solutions

- Consider storing new fields in a new [measurement](/influxdb3/cloud-serverless/reference/glossary/#measurement) (not to exceed the [maximum number of tables](#maximum-number-of-tables-reached)).
- Review [InfluxDB schema design recommendations](/influxdb3/cloud-serverless/write-data/best-practices/schema-design/).
- Customers with an [annual or support contract](https://www.influxdata.com/influxdb-cloud-pricing/) can contact [InfluxData Support](https://support.influxdata.com) to request a review of their database schema.

#### Maximum number of tables reached

```http
dml handler error: service limit reached: couldn't create new table; namespace contains <N> existing
tables, applying this write would result in <N+> columns, limit is 500
```

This error is returned for any write request that would exceed the maximum
number of tables (measurements) allowed in a namespace.

### Error messages in the UI

The {{< product-name >}} UI displays a notification message when service quotas or limits are exceeded.
The error messages correspond with the relevant [API error response messages](#api-error-response-messages).

Errors can also be viewed in the [Usage page](/influxdb3/cloud-serverless/admin/billing/data-usage/)
under **Limit Events**--for example: `event_type_limited_query`, `event_type_limited_write`,
or `event_type_limited_delete_rate`.

### API error response messages

The following API error responses occur when your plan's service quotas are exceeded.

| HTTP response code              | Error message                               | Description  |
| :-----------------------------  | :-----------------------------------------  | :----------- |
| `HTTP 413 "Request Too Large"`  | cannot read data: points in batch is too large | If a **write** request exceeds the maximum [global limit](#global-limits) |  
| `HTTP 429 "Too Many Requests"`  | Retry-After: xxx (seconds to wait before retrying the request) | If a **read** or **write** request exceeds your plan's [adjustable service quotas](#adjustable-service-quotas) or if a **delete** request exceeds the maximum [global limit](#global-limits) |

#### Error messages and their meaning

- [Exceeded limited_write plan limit](#exceeded-limited_write-plan-limit)
- [Exceeded limited_query plan limit](#exceeded-limited_query-plan-limit)
- [Exceeded limited_query_time plan limit](#exceeded-limited_query_time-plan-limit)

##### Exceeded limited_write plan limit

```http
org <ORG_ID> has exceeded limited_write plan limit
```

The `exceeded limited_write plan limit` error message means you have exceeded
the amount of data your organization can write in a five minute period.

_See [Free plan--Data-in limit](/influxdb3/cloud-serverless/admin/billing/limits/#free-plan)
and [Usage-based plan--Data-in limit](/influxdb3/cloud-serverless/admin/billing/limits/#usage-based-plan)._

##### Exceeded limited_query plan limit

```http
org <ORG_ID> has exceeded limited_query plan limit
```

The `exceeded limited_query plan limit` error message means you have exceeded
the amount of data your organization can query in a five minute period.

_See [Free plan--Read limit](/influxdb3/cloud-serverless/admin/billing/limits/#free-plan)
and [Usage-based plan--Read limit](/influxdb3/cloud-serverless/admin/billing/limits/#usage-based-plan)._

##### Exceeded limited_query_time plan limit

```http
org <ORG_ID> has exceeded limited_query_time plan limit
```

The `exceeded limited_query_time plan limit` error message means your organization
has exceeded the amount of time allowed for query execution in a 30s period.

_[See Global limits--Total query time](/influxdb3/cloud-serverless/admin/billing/limits/#global-limits)._

### Read (query) limit errors

#### Query would process too many files or partitions

The Flight request returns the following gRPC error code

```http
ResourceExhausted
```

And the error message contains detail about the exceeded [Free Plan](#free-plan) or [Usage-Based Plan](#usage-based-plan) query limit--for example:

```http
 Query would process more than 500 partitions
 ```

 ```http
Query would process more than 1000 parquet files
```

To avoid these errors, split your query into multiple queries that retrieve fewer files or partitions.
For example, because {{% product-name %}} partitions data by day, you can [use time boundaries](/influxdb3/cloud-serverless/query-data/sql/basic-query/#query-data-within-time-boundaries) to limit the number of partitions retrieved.
