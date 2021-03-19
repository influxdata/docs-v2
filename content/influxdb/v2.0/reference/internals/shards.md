---
title: InfluxDB shards and shard groups
description: >
  Learn the relationships between buckets, shards, and shard groups.
  InfluxDB organizes time series data in into **shards** when storing data to disk.
  Shards are grouped into **shard groups**.
menu:
  influxdb_2_0_ref:
    name: Shards & shard groups
    parent: InfluxDB internals
weight: 102
influxdb/v2.0/tags: [storage, internals]
related:
  - /influxdb/v2.0/organizations/buckets/
  - /influxdb/v2.0/reference/cli/influx/bucket/
---

InfluxDB organizes time series data in into **shards** when storing data to disk.
Shards are grouped into **shard groups**.
Learn the relationships between buckets, shards, and shard groups.

<!-- page TOC -->

## Shards
A shard contains encoded and compressed time series data for a given time range
defined by the [shard group duration](#shard-group-duration).
All points in a [series](#series) within the shard's time range are stored in the same shard.
A single shard contains multiple series.
On disk, each [TSM file](/influxdb/v2.0/reference/internals/storage-engine/#time-structured-merge-tree-tsm) represents a shard.
A shard belongs to a [shard group](#shard-groups).

## Shard groups
Shard groups are logical containers for InfluxDB shards.
A single shard group covers a specific time range defined by
the [shard group duration](#shard-group-duration).
A shard group belongs to an InfluxDB [bucket](/influxdb/v2.0/reference/glossary/#bucket).

{{% note %}}
In **InfluxDB OSS**, a shard group typically contains only a single shard.
In an InfluxDB Enterprise 1.x cluster, shard groups contain multiple shards that
that are distributed across multiple data nodes.
{{% /note %}}

### Shard group duration
The shard group duration determines the time range a shard group covers
and the interval at which new shard groups are created.
By default, InfluxDB determines shard group durations using
the [retention period](/influxdb/v2.0/reference/glossary/#retention-period)
of the bucket:

| Bucket retention period     | Default shard group duration |
|:-----------------------     | ----------------------------:|
| less than 2 days            | 1h                           |
| between 2 days and 6 months | 1d                           |
| greater than 6 months       | 7d                           |

You can also [manually configure the shard group duration](#) for each bucket.
**Shard group durations must be less than the bucket's retention period.**

To view your bucket's shard group duration, use the
[`influx bucket list` command](/influxdb/v2.0/reference/cli/influx/bucket/list/).

### Shard group diagram
The following diagram represents a **bucket** with a **4d retention period**
and a **1d shard group duration**:

---

{{< html-diagram/shards >}}

---

## Shard life-cycle

### Shard precreation
  - [`storage-shard-precreator-advance-period`](/influxdb/v2.0/reference/config-options/#storage-shard-precreator-advance-period)
  - [`storage-shard-precreator-check-interval`](/influxdb/v2.0/reference/config-options/#storage-shard-precreator-check-interval)

### Hot and cold shards
Shards are generally described in two states: **hot** or **cold**.

- **Hot shards:** un-compacted shards actively being written to
- **Cold shards:** compacted shards not actively being written to

Typically, only the most recent shard group contains hot shards, but when backfilling
historical data, all shards that recieve newly written historical data are made hot,
then re-compacted after the back fill is done.

### Shard compaction
- Shards are compacted at regular intervals
- Optimizes disk usage by compressing shards are aren't actively being used.

## Deleting expired shard groups
- Can only delete the entire shard group
- Once an entire shard group ages out of the bucket's retention period, the shard group is deleted.
- Won't delete the shard group until shards are cold
- [`storage-retention-check-interval`](/influxdb/v2.0/reference/config-options/#storage-retention-check-interval)
