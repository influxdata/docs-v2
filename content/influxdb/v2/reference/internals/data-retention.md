---
title: Data retention in InfluxDB
description: >
  The InfluxDB retention service checks for and removes data with timestamps beyond
  the defined retention period of the bucket the data is stored in.
weight: 103
menu:
  influxdb_v2:
    name: Data retention
    parent: InfluxDB internals
influxdb/v2/tags: [storage, internals]
related:
  - /influxdb/v2/admin/buckets/create-bucket/
  - /influxdb/v2/reference/internals/shards/
  - /influxdb/v2/reference/internals/storage-engine/
  - /influxdb/v2/admin/internals/
---

The **InfluxDB retention enforcement service** checks for and removes data with
timestamps beyond the defined retention period of the
[bucket](/influxdb/v2/reference/glossary/#bucket) the data is stored in.
This service is designed to automatically delete "expired" data and optimize disk
usage without any user intervention.

By default, the retention enforcement service runs every 30 minutes.
You can
configure this interval with the
[`storage-retention-check-interval`](/influxdb/v2/reference/config-options/#storage-retention-check-interval)
configuration option.

- [Bucket retention period](#bucket-retention-period)
- [Shard group duration](#shard-group-duration)
- [When does data actually get deleted?](#when-does-data-actually-get-deleted)

## Bucket retention period
A **bucket retention period** is the [duration](/influxdb/v2/reference/glossary/#duration)
of time that a bucket retains data.
You can specify the retention period when you [create](/influxdb/v2/admin/buckets/create-bucket/) or [update](/influxdb/v2/admin/buckets/update-bucket/) a bucket.
Retention periods can be infinite or as short as an hour.
[Points](/influxdb/v2/reference/glossary/#point)
in a bucket with timestamps beyond the defined retention period (relative to now)
are _eligible_ for deletion.

## Shard group duration
InfluxDB stores data on disk in [shards](/influxdb/v2/reference/glossary/#shard).
Each shard belongs to a shard group and each shard group has a shard group duration.
The **shard group duration** defines the duration of time that each
shard in the shard group covers.
Each shard contains only points with timestamps in a specific time range defined
by the shard group duration.

By default, shard group durations are set automatically based on the bucket retention
period, but can also be explicitly defined when creating or updating a bucket.

_For more information, see [InfluxDB shard group duration](/influxdb/v2/reference/internals/shards/#shard-group-duration)._

{{% note %}}
#### View bucket retention periods and shard group durations
Use the [`influx bucket list` command](/influxdb/v2/reference/cli/influx/bucket/list/)
to view the retention period and shard group duration of buckets in your organization.
{{% /note %}}

## When does data actually get deleted?
The InfluxDB retention enforcement service runs at regular intervals and deletes
[shard groups](/influxdb/v2/reference/internals/shards/#shard-groups), not individual points.
The service will only delete a shard group when the entire time range covered by
the shard group is beyond the bucket retention period.

{{% note %}}
#### Data is queryable until deleted
Even though data may be older than the specified bucket retention period,
it is queryable until removed by the retention enforcement service.
{{% /note %}}

To calculate the possible time data will persist before being deleted:

- **minimum**: `bucket-retention-period`
- **maximum** `bucket-retention-period + shard-group-duration`

For example, if your bucket retention period is three days (`3d`) and your
shard group duration is one day (`1d`), the retention enforcement service
deletes all shard groups with data that is **three to four days old** the next
time the service runs.

{{< html-diagram/data-retention >}}
