---
title: Data retention in InfluxDB Cloud Serverless
description: >
  InfluxDB Cloud Serverless enforces bucket retention periods at query time
  and, to optimize storage, routinely deletes [Parquet](https://parquet.apache.org/)
  files containing only expired data.
weight: 103
menu:
  influxdb3_cloud_serverless:
    name: Data retention
    parent: InfluxDB Cloud internals
influxdb3/cloud-serverless/tags: [internals]
---

{{< product-name >}} enforces bucket retention periods at query time.
Any points with timestamps beyond a bucket's [retention period](#bucket-retention-period)
are filtered out of query results, even though the data may still exist.

- [Bucket retention period](#bucket-retention-period)
- [When does data actually get deleted?](#when-does-data-actually-get-deleted)

## Bucket retention period

A **bucket retention period** is the duration of time that a bucket retains data.
Retention periods are designed to automatically delete expired data and optimize
storage without any user intervention.

Retention periods can be as short as an hour or infinite.
[Points](/influxdb3/cloud-serverless/reference/glossary/#point) in a bucket with
timestamps beyond the defined retention period (relative to now) are not queryable,
but may still exist in storage until [fully deleted](#when-does-data-actually-get-deleted).

> [!Note]
> #### View bucket retention periods
> 
> Use the [`influx bucket list` command](/influxdb3/cloud-serverless/reference/cli/influx/bucket/list/)
> to view your buckets' retention periods.

## When does data actually get deleted?

InfluxDB routinely deletes [Parquet](https://parquet.apache.org/) files containing only expired data.
InfluxDB retains expired Parquet files for at least 100 days for disaster recovery.
After the disaster recovery period, expired Parquet files are permanently deleted
and can't be recovered.
