---
title: Data retention in InfluxDB Cloud
description: >
  The InfluxDB Cloud retention service checks for and removes data with timestamps
  beyond the defined retention period of the bucket the data is stored in.
weight: 103
menu:
  influxdb_cloud:
    name: Data retention
    parent: InfluxDB Cloud internals
influxdb/cloud/tags: [internals]
---

The **InfluxDB Cloud retention enforcement service** checks for and removes data
with timestamps beyond the defined retention period of the
[bucket](/influxdb/cloud/reference/glossary/#bucket) the data is stored in.
This service is designed to automatically delete "expired" data and optimize disk
usage without any user intervention.

- [Bucket retention period](#bucket-retention-period)
- [When does data actually get deleted?](#when-does-data-actually-get-deleted)

## Bucket retention period
A **bucket retention period** is the duration of time that a bucket retains data.
Retention periods can be as short as an hour or infinite.
[Points](/influxdb/cloud/reference/glossary/#point) in a bucket with timestamps
beyond the defined retention period (relative to now) are flagged for deletion
(also known as "tombstoned").

{{% note %}}
#### View bucket retention periods
Use the [`influx bucket list` command](/influxdb/cloud/reference/cli/influx/bucket/list/)
to view the retention period buckets in your organization.
{{% /note %}}

## When does data actually get deleted?
The InfluxDB Cloud retention enforcement service **runs hourly** and tombstones
all points with timestamps beyond the bucket retention period.
Tombstoned points persist on disk, but are filtered from all query results until
the next [compaction](/influxdb/cloud/reference/glossary/#compaction) cycle,
when they are removed from disk.
Compaction cycle intervals vary.
