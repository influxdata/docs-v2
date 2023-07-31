---
title: Data retention in InfluxDB Cloud Dedicated
description: >
  InfluxDB Cloud Dedicated enforces database retention periods at query time
  and, to optimize storage, routinely deletes [Parquet](https://parquet.apache.org/)
  files containing only expired data.
weight: 103
menu:
  influxdb_cloud_dedicated:
    name: Data retention
    parent: InfluxDB internals
influxdb/cloud-dedicated/tags: [internals]
---

{{< cloud-name >}} enforces database retention periods at query time.
Any points with timestamps beyond a database's [retention period](#database-retention-period)
are filtered out of query results, even though the data may still exist.

- [Database retention period](#database-retention-period)
- [When does data actually get deleted?](#when-does-data-actually-get-deleted)

## Database retention period

A **database retention period** is the duration of time that a database retains data.
Retention periods are designed to automatically delete expired data and optimize
storage without any user intervention.

Retention periods can be as short as an hour or infinite.
[Points](/influxdb/cloud-dedicated/reference/glossary/#point) in a database with
timestamps beyond the defined retention period (relative to now) are not queryable,
but may still exist in storage until [fully deleted](#when-does-data-actually-get-deleted).

{{% note %}}
#### View database retention periods

Use the [`influxctl database list` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/list/)
to view your databases' retention periods.
{{% /note %}}

## When does data actually get deleted?

InfluxDB routinely deletes [Parquet](https://parquet.apache.org/) files containing only expired data.
InfluxDB retains expired Parquet files for at least 100 days for disaster recovery.
After the disaster recovery period, expired Parquet files are permanently deleted
and can't be recovered.
