---
title: InfluxDB shards and shard groups
description: >
  Learn the relationships between buckets, shards, and shard groups.
  InfluxDB organizes time series data into **shards** when storing data to disk.
  Shards are grouped into **shard groups**.
menu:
  influxdb_v2:
    name: Shards & shard groups
    parent: InfluxDB internals
weight: 103
influxdb/v2/tags: [storage, internals]
related:
  - /influxdb/v2/reference/internals/storage-engine/
  - /influxdb/v2/admin/buckets/
  - /influxdb/v2/reference/cli/influx/bucket/
  - /influxdb/v2/admin/internals/
---

InfluxDB organizes time series data into **shards** when storing data to disk.
Shards are grouped into **shard groups**.
Learn the relationships between buckets, shards, and shard groups.

- [Shards](#shards)
- [Shard groups](#shard-groups)
  - [Shard group duration](#shard-group-duration)
  - [Shard group diagram](#shard-group-diagram)
- [Shard life-cycle](#shard-life-cycle)
  - [Shard precreation](#shard-precreation)
  - [Shard writes](#shard-writes)
  - [Shard compaction](#shard-compaction)
- [Shard deletion](#shard-deletion)

## Shards
A shard contains encoded and compressed time series data for a given time range
defined by the [shard group duration](#shard-group-duration).
All points in a [series](#series) within the specified shard group duration are stored in the same shard.
A single shard contains multiple series, one or more [TSM files](#tsm-time-structured-merge-tree) on disk,
and belongs to a [shard group](#shard-groups).

## Shard groups
A shard group belongs to an InfluxDB [bucket](/influxdb/v2/reference/glossary/#bucket) and contains time series data for a specific time range defined by
the [shard group duration](#shard-group-duration).

{{% note %}}
In **InfluxDB OSS**, a shard group typically contains only a single shard.
In an **InfluxDB Enterprise 1.x cluster**, shard groups contain multiple shards
distributed across multiple data nodes.
{{% /note %}}

### Shard group duration
The **shard group duration** specifies the time range for each shard group and determines how often to create a new shard group.
By default, InfluxDB sets the shard group duration according to
the [retention period](/influxdb/v2/reference/glossary/#retention-period)
of the bucket:

| Bucket retention period     | Default shard group duration |
|:-----------------------     | ----------------------------:|
| less than 2 days            | 1h                           |
| between 2 days and 6 months | 1d                           |
| greater than 6 months       | 7d                           |

##### Shard group duration configuration options
To configure a custom bucket shard group duration, use the `--shard-group-duration`
flag with the [`influx bucket create`](/influxdb/v2/reference/cli/influx/bucket/create/#create-a-custom-shard-group-duration)
and [`influx bucket update`](/influxdb/v2/reference/cli/influx/bucket/update//#update-the-shard-group-duration-of-a-bucket) commands.

{{% note %}}
Shard group durations must be shorter than the bucket's retention period.
{{% /note %}}

To view your bucket's shard group duration, use the
[`influx bucket list` command](/influxdb/v2/reference/cli/influx/bucket/list/).

### Shard group diagram
The following diagram represents a **bucket** with a **4d retention period**
and a **1d shard group duration**:

---

{{< html-diagram/shards >}}

---

## Shard life-cycle

### Shard precreation
The InfluxDB **shard precreation service** pre-creates shards with future start
and end times for each shard group based on the shard group duration.

The precreator service does not pre-create shards for past time ranges.
When backfilling historical data, InfluxDB creates shards for past time ranges as needed,
resulting in temporarily lower write throughput.

##### Shard precreation-related configuration settings
- [`storage-shard-precreator-advance-period`](/influxdb/v2/reference/config-options/#storage-shard-precreator-advance-period)
- [`storage-shard-precreator-check-interval`](/influxdb/v2/reference/config-options/#storage-shard-precreator-check-interval)

### Shard writes
InfluxDB writes time series data to un-compacted or "hot" shards.
When a shard is no longer actively written to, InfluxDB [compacts](#shard-compaction) shard data, resulting in a "cold" shard.

Typically, InfluxDB writes data to the most recent shard group, but when backfilling
historical data, InfluxDB writes to older shards that must first be un-compacted.
When the backfill is complete, InfluxDB re-compacts the older shards.

### Shard compaction

InfluxDB compacts shards at regular intervals to compress time series data and optimize disk usage. When compactions are enabled, InfluxDB checks to see whether shard compactions are needed every second. If there haven't been writes during the `compact-full-write-cold-duration` period (by default, `4h`), InfluxDB compacts all TSM files. Otherwise, InfluxDB groups TSM files into compaction levels (determined by the number of times the file have been compacted), and attempts to combine files and compress them more efficiently.

InfluxDB uses the following four compaction levels:

- **Level 0 (L0):** The log file (`LogFile`) is considered level 0 (L0). Once this file exceeds a `5MB` threshold, InfluxDB creates a new active log file, and the previous one begins compacting into an `IndexFile`. This first index file is at level 1 (L1).
- **Level 1 (L1):** InfluxDB flushes all newly written data held in an in-memory cache to disk into an `IndexFile`.
- **Level 2 (L2):** InfluxDB compacts up to eight L1-compacted files into one or more L2 files by
     combining multiple blocks containing the same series into fewer blocks in one or more new files.
- **Level 3 (L3):** InfluxDB iterates over L2-compacted file blocks (over a certain size)
  and combines multiple blocks containing the same series into one block in a new file.
- **Level 4 (L4):** **Full compaction** InfluxDB iterates over L3-compacted file blocks
  and combines multiple blocks containing the same series into one block in a new file.

InfluxDB schedules compactions preferentially, using the following guidelines:

- The lower the level (fewer times the file has been compacted), the more weight is given to compacting the file.
- The more compactible files in a level, the higher the priority given to compacting that level. If the number of files in each level is equal, lower levels are compacted first.
- If a higher level has more candidates for compaction, it may be compacted before a lower level. InfluxDB multiplies the number of collection groups (collections of files to compact into a single next-generation file) by a specified weight (0.4, 0.3, 0.2, and 0.1) per level, to determine the compaction priority.

##### Shard compaction-related configuration settings

The following configuration settings are especially beneficial for systems with irregular loads, because they limit compactions during periods of high usage, and let compactions catch up during periods of lower load:

- [`storage-compact-full-write-cold-duration`](/influxdb/v2/reference/config-options/#storage-compact-full-write-cold-duration)
- [`storage-compact-throughput-burst`](/influxdb/v2/reference/config-options/#storage-compact-throughput-burst)
- [`storage-max-concurrent-compactions`](/influxdb/v2/reference/config-options/#storage-max-concurrent-compactions)
- [`storage-max-index-log-file-size`](/influxdb/v2/reference/config-options/#storage-max-index-log-file-size)
- [`storage-series-file-max-concurrent-snapshot-compactions`](/influxdb/v2/reference/config-options/#storage-series-file-max-concurrent-snapshot-compactions)
- [`storage-series-file-max-concurrent-snapshot-compactions`](/influxdb/v2/reference/config-options/#storage-series-file-max-concurrent-snapshot-compactions)

In systems with stable loads, if compactions interfere with other operations, typically, the system is undersized for its load, and configuration changes won't help much.

## Shard deletion
The InfluxDB **retention enforcement service** routinely checks for shard groups
older than their bucket's retention period.
Once the start time of a shard group is beyond the bucket's retention period,
InfluxDB deletes the shard group and associated shards and TSM files.

In buckets with an infinite retention period, shards remain on disk indefinitely.

{{% note %}}
#### InfluxDB only deletes cold shards
InfluxDB only deletes **cold** shards.
If backfilling data beyond a bucket's retention period, the backfilled data will
remain on disk until the following occurs:

1. The shard returns to a cold state.
2. The retention enforcement service deletes the shard group.
{{% /note %}}

##### Retention enforcement-related configuration settings
- [`storage-retention-check-interval`](/influxdb/v2/reference/config-options/#storage-retention-check-interval)
