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
  - /influxdb/v2.0/reference/internals/storage-engine/
  - /influxdb/v2.0/organizations/buckets/
  - /influxdb/v2.0/reference/cli/influx/bucket/
---

InfluxDB organizes time series data in into **shards** when storing data to disk.
Shards are grouped into **shard groups**.
Learn the relationships between buckets, shards, and shard groups.

- [Shards](#shards)
- [Shard groups](#shard-groups)
  - [Shard group duration](#shard-group-duration)
  - [Shard group diagram](#shard-group-diagram)
- [Shard life-cycle](#shard-life-cycle)
  - [Shard precreation](#shard-precreation)
  - [Shard states](#shard-states)
  - [Shard compaction](#shard-compaction)
- [Shard deletion](#shard-deletion)

## Shards
A shard contains encoded and compressed time series data for a given time range
defined by the [shard group duration](#shard-group-duration).
All points in a [series](#series) within the shard's time range are stored in the same shard.
A single shard contains multiple series, multiple [TSM files](#tsm-time-structured-merge-tree) on disk,
and belongs to a [shard group](#shard-groups).

## Shard groups
A shard group belongs to an InfluxDB [bucket](/influxdb/v2.0/reference/glossary/#bucket) and contains time series data for a specific time range defined by
the [shard group duration](#shard-group-duration).
.

{{% note %}}
In **InfluxDB OSS**, a shard group typically contains only a single shard.
In an **InfluxDB Enterprise 1.x cluster**, shard groups contain multiple shards
distributed across multiple data nodes.
{{% /note %}}

### Shard group duration
The **shard group duration** determines the time range a shard group covers
and the interval at which new shard groups are created.
By default, InfluxDB determines shard group durations using
the [retention period](/influxdb/v2.0/reference/glossary/#retention-period)
of the bucket:

| Bucket retention period     | Default shard group duration |
|:-----------------------     | ----------------------------:|
| less than 2 days            | 1h                           |
| between 2 days and 6 months | 1d                           |
| greater than 6 months       | 7d                           |

#### Manage shard group durations
To configure a custom bucket shard group duration, use the `--shard-group-duration`
flag with the [`influx bucket create`](/influxdb/v2.0/reference/cli/influx/bucket/create/#create-a-custom-shard-group-duration)
and [`influx bucket update`](/influxdb/v2.0/reference/cli/influx/bucket/update//#update-the-shard-group-duration-of-a-bucket) commands.

{{% note %}}
Shard group durations must be shorter than the bucket's retention period.
{{% /note %}}

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
InfluxDB **shard precreation service** creates new shards with future start and end times before data arrives.
It does not create shards that are either wholly or partially in the past.

#### Configure shard precreation
To configure the InfluxDB shard precreation service, use the following `influxd`
configuration settings:

- [`storage-shard-precreator-advance-period`](/influxdb/v2.0/reference/config-options/#storage-shard-precreator-advance-period)
- [`storage-shard-precreator-check-interval`](/influxdb/v2.0/reference/config-options/#storage-shard-precreator-check-interval)

### Shard states
A shard can be in one of two states: **hot** or **cold**.

- **Hot shards:** [Un-compacted](#shard-compaction) shards actively being written to.
- **Cold shards:** [Compacted](#shard-compaction) shards not actively being written to.

To write to a shard, the shard must be hot (un-compacted).
Typically, only the most recent shard group contains hot shards, but when backfilling
historical data, all shards that receive newly written historical data are hot
until the backfill is complete and the shards are re-compacted.

### Shard compaction
InfluxDB compacts shards at regular intervals to compress time series data and optimize disk usage. InfluxDB uses the following four compaction levels:
- **Level 1 (L1):** InfluxDB flushes all newly written data held in an in-memory cache to disk.
- **Level 2 (L2):** InfluxDB compacts up to eight L1-compacted files into one or more L2 files by
     combining multiple blocks containing the same series into fewer blocks in one or more new files.
- **Level 3 (L3):** InfluxDB iterates over L2-compacted file blocks (over a certain size)
  and combines multiple blocks containing the same series into one block in a new file.
- **Level 4 (L4):** **Full compaction**—InfluxDB iterates over L3-compacted file blocks
  and combines multiple blocks containing the same series into one block in a new file.

#### Configure shard compaction
To configure the InfluxDB compaction service, use the following `influxd` configuration settings:

- [`storage-compact-full-write-cold-duration`](/influxdb/v2.0/reference/config-options/#storage-compact-full-write-cold-duration)
- [`storage-compact-throughput-burst`](/influxdb/v2.0/reference/config-options/#storage-compact-throughput-burst)
- [`storage-max-concurrent-compactions`](/influxdb/v2.0/reference/config-options/#storage-max-concurrent-compactions)
- [`storage-max-index-log-file-size`](/influxdb/v2.0/reference/config-options/#storage-max-index-log-file-size)
- [`storage-series-file-max-concurrent-snapshot-compactions`](/influxdb/v2.0/reference/config-options/#storage-series-file-max-concurrent-snapshot-compactions)
- [`storage-series-file-max-concurrent-snapshot-compactions`](/influxdb/v2.0/reference/config-options/#storage-series-file-max-concurrent-snapshot-compactions)

## Shard deletion
The InfluxDB **retention enforcement** service routinely checks for shard groups
older than their bucket's retention period.
Once the start time of a shard group is beyond the bucket's retention period,
InfluxDB deletes the shard group and associated shards and TSM files.

In buckets with an infinite retention period, shards remain on disk indefinitely.

{{% note %}}
#### InfluxDB only deletes cold shards
InfluxDB only deletes **cold** shards.
If backfilling data beyond a bucket's retention period, the backfilled data will
remain on disk until:

1. The shard returns to a cold state.
2. The retention enforcement service deletes the shard group.
{{% /note %}}

#### Configure retention enforcement
To configure the InfluxDB retention enforcement service, use the following
`influxd` configuration setting:

- [`storage-retention-check-interval`](/influxdb/v2.0/reference/config-options/#storage-retention-check-interval)
