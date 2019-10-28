---
title: InfluxDB storage engine
description: >
  An overview of the InfluxDB storage engine architecture.
weight: 7
menu:
  v2_0_ref:
    name: Storage engine
    parent: Internals
v2.0/tags: [storage, internals]
---

The InfluxDB storage engine ensures the following three things:

- Data is safely written to disk
- Queried data is returned complete and correct
- Data is accurate (first) and performant (second)

This document details the internal workings of the storage engine.
This information is presented both as a reference and to aid those looking to maximize performance.

Major topics include:

* [Write Ahead Log (WAL)](#write-ahead-log-wal)
* [Time-Structed Merge Tree (TSM)](#time-structured-merge-tree-tsm)
* [Time Series Index (TSI)](#time-series-index-tsi)

## Writing data: from API to disk

The storage engine handles data from the point an API request is received through writing it to the physical disk.
Data is written to InfluxDB using [line protocol](/v2.0/reference/line-) sent via HTTP POST request to the `/write` endpoint.
Batches of [points](/v2.0/reference/glossary/#point) are sent to InfluxDB, compressed, and written to a WAL for immediate durability.
The points are also written to an in-memory cache and become immediately queryable.
The cache is periodically written to disk in the form of [TSM](#time-structured-merge-tree-tsm) files.
As TSM files accumulate, they are combined and compacted into higher level TSM files.

Points can be sent individually; however, for efficiency, most applications send points in batches.
<!-- Batch size ranges from hundreds to thousands of points. -->
Points in a POST body can be from an arbitrary number of series, measurements, and tag sets.
Points in a batch do not have to be from the same measurement or tagset.

## Write Ahead Log (WAL)

The **Write Ahead Log** (WAL) ensures durability by retaining data when the storage engine restarts.
It ensures that written data does not disappear in an unexpected failure.
When a client sends a write request, the following occurs:

1. Write request is appended to the end of the WAL file.
2. `fsync()` the data to the file.
3. Update the in-memory database.
   <!-- 3. Update the in-memory CACHE? -->
4. Return success to caller.

`fsync()` takes the file and pushes pending writes all the way through any buffers and caches to disk.
As a system call, `fsync()` has a kernel context switch which is expensive _in terms of time_ but guarantees your data is safe on disk.

{{% note%}}
To `fsync()` less frequently, batch your points.
{{% /note %}}

When the storage engine restarts, the WAL file is read back into the in-memory database.
InfluxDB then snswer requests to the `/read` endpoint.

<!-- ===== V1 material -->
<!-- TODO is this still true? -->
<!-- On the file system, the WAL is made up of sequentially numbered files (`_000001.wal`). -->
<!-- The file numbers are monotonically increasing and referred to as WAL segments. -->
<!-- When a segment reaches 10MB in size, it is closed and a new one is opened. Each WAL segment stores multiple compressed blocks of writes and deletes. -->
<!-- Each entry in the WAL follows a [TLV standard](https://en.wikipedia.org/wiki/Type-length-value) with a single byte representing the type of entry (write or delete), a 4 byte `uint32` for the length of the compressed block, and then the compressed block. -->

{{% note%}}
Once you receive a response to a write request, your data is on disk!
{{% /note %}}

## Cache

The **cache** is an in-memory copy of data points current stored in the WAL.
Points are organized by the key, which is the measurement, tag set, and unique field.
Each field is stored in its own time-ordered range.
Data is not compressed in the cache.
The cache is recreated on restart by re-reading the WAL files on disk back into memory.
The cache is queried at runtime and merged with the data stored in TSM files.

<!-- When the storage engine restarts, WAL files are written to the in-memory cache. -->

Queries to the storage engine will merge data from the cache with data from the TSM files.
Queries execute on a copy of the data that is made from the cache at query processing time.
This way writes that come in while a query is running won’t affect the result.

Deletes sent to the Cache will clear out the given key or the specific time range for the given key.

## Time-Structured Merge Tree (TSM)

To efficiently compact and store data,
the storage engine groups field values by [series](/v2.0/reference/key-concepts/data-elements/#series) key,
and then orders those field values by time.

The storage engine uses a **Time-Structured Merge Tree** (TSM) data format.
TSM files store compressed series data in a columnar format.
To improve efficiency, the storage engine only stores differences between values in a series.
Column-oriented storage means we can read by series key and ignore what it doesn't need.
Storing data in columns lets the storage engine read by series key.

<!-- TERMS -->
Some terminology:

- a *series key* is defined by measurement, tag key and value, and field key.
- a *point* is a series key, field value, and timestamp.

After fields are stored safely in TSM files, WAL is truncated...
<!-- TODO what next? -->

There’s a lot of logic and sophistication in the TSM compaction code.
However, the high-level goal is quite simple:
organize values for a series together into long runs to best optimize compression and scanning queries.

## Time Series Index (TSI)

As data cardinality (number of series) grows, queries read more series keys and become slower.

The **Time Series Index** ensures queries fast as data cardinality of data grows...
To keep queries fast as we have more data, we use a **Time Series Index**.

TSI stores series keys grouped by measurement, tag, and field.
In data with high cardinality (a large quantity of series), it becomes slower to search through all series keys.
The TSI stores series keys grouped by measurement, tag, and field.
TSI answers two questions well:
1) What measurements, tags, fields exist?
2) Given a measurement, tags, and fields, what series keys exist?

<!-- ## Shards -->
<!-- A shard contains: -->
<!--   WAL files -->
<!--   TSM files -->
<!--   TSI files -->
<!-- Shards are time-bounded -->
<!-- Retention policies have properties: duration and shard duration -->
<!-- colder shards get more compacted -->

<!-- =========== QUESTIONS -->
<!-- Which parts of cache and WAL are configurable? -->
<!-- Should we even mention shards? -->

<!-- =========== OTHER -->
<!-- V1 -->
<!-- - FileStore - The FileStore mediates access to all TSM files on disk. -->
<!--   It ensures that TSM files are installed atomically when existing ones are replaced as well as removing TSM files that are no longer used. -->
<!-- - Compactor - The Compactor is responsible for converting less optimized Cache and TSM data into more read-optimized formats. -->
<!--   It does this by compressing series, removing deleted data, optimizing indices and combining smaller files into larger ones. -->
<!-- - Compaction Planner - The Compaction Planner determines which TSM files are ready for a compaction and ensures that multiple concurrent compactions do not interfere with each other. -->
<!-- - Compression - Compression is handled by various Encoders and Decoders for specific data types. -->
<!--   Some encoders are fairly static and always encode the same type the same way; -->
<!--   others switch their compression strategy based on the shape of the data. -->
<!-- - Writers/Readers - Each file type (WAL segment, TSM files, tombstones, etc..) has Writers and Readers for working with the formats. -->

<!-- === CONFIGURABLES? === -->
<!-- The Cache exposes a few controls for snapshotting behavior. -->
<!-- The two most important controls are the memory limits. -->
<!-- There is a lower bound, [`cache-snapshot-memory-size`](/influxdb/v1.7/administration/config#cache-snapshot-memory-size-25m), which when exceeded will trigger a snapshot to TSM files and remove the corresponding WAL segments. -->
<!-- There is also an upper bound, [`cache-max-memory-size`](/influxdb/v1.7/administration/config#cache-max-memory-size-1g), which when exceeded will cause the Cache to reject new writes. -->
<!-- These configurations are useful to prevent out of memory situations and to apply back pressure to clients writing data faster than the instance can persist it. -->
<!-- The checks for memory thresholds occur on every write. -->
<!-- The other snapshot controls are time based. -->
<!-- The idle threshold, [`cache-snapshot-write-cold-duration`](/influxdb/v1.7/administration/config#cache-snapshot-write-cold-duration-10m), forces the Cache to snapshot to TSM files if it hasn't received a write within the specified interval. -->
