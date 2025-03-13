---
title: Data retention in InfluxDB Cloud Dedicated
description: >
  InfluxDB Cloud Dedicated enforces database retention periods at query time
  and, to optimize storage, routinely deletes [Parquet](https://parquet.apache.org/)
  files containing only expired data.
weight: 103
menu:
  influxdb3_cloud_dedicated:
    name: Data retention
    parent: InfluxDB internals
influxdb3/cloud-dedicated/tags: [internals]
---

{{< product-name >}} enforces database retention periods at query time.
Any points with timestamps beyond a database's [retention period](#database-retention-period)
are filtered out of query results, even though the data may still exist.

- [Database retention period](#database-retention-period)
- [When does data actually get deleted?](#when-does-data-actually-get-deleted)

## Database retention period

A **database retention period** is the duration of time that a database retains data.
Retention periods automatically delete expired data and optimize
storage without the need for user intervention.

Retention periods can be as short as an hour or infinite.
[Points](/influxdb3/cloud-dedicated/reference/glossary/#point) in a database with
timestamps beyond the defined retention period (relative to now) are not queryable,
but may still exist in storage until [fully deleted](#when-does-data-actually-get-deleted).

> [!Note]
> #### View database retention periods
> 
> Use the [`influxctl database list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/list/)
> to view your databases' retention periods.

## When does data actually get deleted?

InfluxDB routinely deletes [Parquet](https://parquet.apache.org/) files containing only expired data.
Expired Parquet files are retained for approximately 30 days for disaster recovery purposes.
After this period, the files are permanently deleted and cannot be recovered.
For more information see [data durability](/influxdb3/cloud-dedicated/reference/internals/durability/).
