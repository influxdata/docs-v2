---
title: InfluxDB storage engine
description: >
  An overview of the InfluxDB storage engine architecture.
weight: 7
menu:
  v2_0_ref:
    name: Storage engine
v2.0/tags: [storage engine, internals, platform]
---

## Introduction

The InfluxDB storage engine ensures the following three things:

- Data is safely written to disk
- Queried data is returned complete and correct
- Data is accurate (first) and performant (second)

This document details the internal workings of the storage engine.
This information is presented both as a reference and to aid those looking to maximize performance.

Major topics include:

* [Write Ahead Log (WAL)](#)
* [Time-Structed Merge Tree (TSM)](#)
* [Time Series Index (TSI)](#)

{{% note %}}
##### At a glance: changes to the storage engine in InfluxDB 2.0
- The InfluxDB 2.0 storage engine no longer partitions data into shards by time.
- **Buckets** replace databases and retention policies.
- Only TSI is used. There is no more in-memory index.
- The configuration interface and options have changed. Configuration options are not currently exposed, but will be.

Read about the [v1 storage engine](https://docs.influxdata.com/influxdb/v1.7/concepts/storage_engine).
{{% /note %}}

## Writing data: from API to disk

In summary, batches of points are POSTed to InfluxDB.
Those batches are snappy compressed and written to a WAL for immediate durability.
The points are also written to an in-memory cache so that newly written points are immediately queryable.
The cache is periodically flushed to TSM files.
As TSM files accumulate, they are combined and compacted into higher level TSM files.
<!-- TSM data is organized into shards. -->
<!-- The time range covered by a shard and the replication factor of a shard in a clustered deployment are configured by the retention policy. -->

<!-- ## /write endpoint -->

Data is written to InfluxDB using [Line protocol](/) sent via HTTP POST request to the `/write` endpoint.
Points can be sent individually; however, for efficiency, most applications send points in batches.
A typical batch ranges in size from hundreds to thousands of points.
Points in a POST body can be from an arbitrary number of series.
Points in a batch do not have to be from the same measurement or tagset.

## Durability: Write Ahead Log (WAL)

<!-- Also mention the cache -->
<!-- Which parts of cache and WAL are configurable? -->

<!-- The WAL is a write-optimized storage format that allows for writes to be durable, but not easily queryable -->

To ensure durability, we use a Write Ahead Log (WAL).
<!-- On the write side, -->
WAL is a data structure and algorithm that is super simple and powerful.
It ensures that written data does not disappear when storage engine restarts.
When a client sends a /write request, the following occurs:

1. Write request is appended to the end of the WAL file.
2. fsync() the data to the file.
3. Update the in-memory database.
4. Return success to caller.

fsync() is a system call, so it has a kernel context switch which costs something.
fsync() takes the file and pushes pending writes all the way through any buffers and caches to disk.
fsync() is expensive _in terms of time_ but guarantees your data is safe on disk.
**Important** to batch your points (send in ~2000 points at a time), to fsync() less frequently.

<!-- On read side: -->
When the storage engine restarts, open WAL file and read it back into the in-memory database.
Answer requests to the /read endpoint.

<!-- So: data durability! Write to disk -->
<!-- Do this with WAL (write-ahead log) -->
<!-- Algorithm that is simple and powerful: -->
<!-- when a write req is ent, append to WAL file, then fsync() file, then update in-memory database, then return "success" to caller -->
<!-- This why it's good to Batch your writes, so that we fsync() less frequently -->
<!-- When storage engine restarts (if we've pulled the plug), "replay" the WAL and then answer /read requests -->

<!-- V1 (edited) -->
<!-- TODO is this still true? -->
<!-- On the file system, the WAL is made up of sequentially numbered files (`_000001.wal`). -->
<!-- The file numbers are monotonically increasing and referred to as WAL segments. -->
<!-- When a segment reaches 10MB in size, it is closed and a new one is opened.  Each WAL segment stores multiple compressed blocks of writes and deletes. -->
<!-- When a write comes in the new points are serialized, compressed using Snappy, and written to a WAL file. -->
<!-- The file is `fsync`'d and the data is added to an in-memory index before a success is returned. -->
<!-- This means that batching points together is required to achieve high throughput performance. -->
<!-- (Optimal batch size seems to be 5,000-10,000 points per batch for many use cases.) -->
<!-- Each entry in the WAL follows a [TLV standard](https://en.wikipedia.org/wiki/Type-length-value) with a single byte representing the type of entry (write or delete), a 4 byte `uint32` for the length of the compressed block, and then the compressed block. -->

{{% note%}}
Once you receive a response to a write request, your data is on disk!
{{% /note %}}

## Cache

Queries to the storage engine will merge data from the Cache with data from the TSM files.
Queries execute on a copy of the data that is made from the cache at query processing time.
This way writes that come in while a query is running won’t affect the result.

<!-- - Cache - The Cache is an in-memory representation of the data stored in the WAL. -->
<!--   It is queried at runtime and merged with the data stored in TSM files. -->

<!-- V1 -->
The Cache is an in-memory copy of all data points current stored in the WAL.
The points are organized by the key, which is the measurement, [tag set](/influxdb/v1.7/concepts/glossary/#tag-set), and unique [field](/influxdb/v1.7/concepts/glossary/#field).
Each field is kept as its own time-ordered range.
The Cache data is not compressed while in memory.

Deletes sent to the Cache will clear out the given key or the specific time range for the given key.

<!-- === CONFIGURABLES === -->
<!-- The Cache exposes a few controls for snapshotting behavior. -->
<!-- The two most important controls are the memory limits. -->
<!-- There is a lower bound, [`cache-snapshot-memory-size`](/influxdb/v1.7/administration/config#cache-snapshot-memory-size-25m), which when exceeded will trigger a snapshot to TSM files and remove the corresponding WAL segments. -->
<!-- There is also an upper bound, [`cache-max-memory-size`](/influxdb/v1.7/administration/config#cache-max-memory-size-1g), which when exceeded will cause the Cache to reject new writes. -->
<!-- These configurations are useful to prevent out of memory situations and to apply back pressure to clients writing data faster than the instance can persist it. -->
<!-- The checks for memory thresholds occur on every write. -->
<!-- The other snapshot controls are time based. -->
<!-- The idle threshold, [`cache-snapshot-write-cold-duration`](/influxdb/v1.7/administration/config#cache-snapshot-write-cold-duration-10m), forces the Cache to snapshot to TSM files if it hasn't received a write within the specified interval. -->

The cache is recreated on restart by re-reading the WAL files on disk back into memory.

## Time-Structured Merge Tree

<!-- - TSM Files - TSM files store compressed series data in a columnar format. -->


Now let's handle more Data!
Queries get slower as data grows
Service terminates if data size exceeds memory...

**Time-Structured Merge Tree** (TSM) is our data format
We group field values grouped by series key, then order field values by time

<!-- TERMS -->
series key = measurement, tag key+value, field key
point = series key, field value, timestamp

Within a series, we store only differences between values, which is more efficient.

Column-Oriented storage means we can read by series key and ignore what it doesn't need.

Compression helps with performance.

After fields are stored safely in TSM files, WAL is truncated...
<!-- TODO what next? -->
(This stuff is configurable)

There’s a lot of logic and sophistication in the TSM compaction code.
However, the high-level goal is quite simple:
organize values for a series together into long runs to best optimize compression and scanning queries.

## TSI

To keep queries fast as we have more data, we use a **Time Series Index**.
cardinality = quantity of series keys
With high cardinality, we have to search through all series keys.
So how to quickly find and match series keys?
We use Time Series Index (TSI), which stores series keys grouped by measurement,tag,field
TSI answers question what measurements, tags, fields exist?
<!-- TODO there's another Question TSI answers... -->

<!-- ## Retention-->
<!-- TODO should we even mention shards? -->

<!-- A shard contains: -->
<!--   WAL files -->
<!--   TSM files -->
<!--   TSI files -->
<!-- Shards are time-bounded -->
<!-- Retention policies have properties: duration and shard duration -->

<!-- colder shards get more compacted -->

<!-- _2.0 changes to storage engines_ -->
<!-- In OSS 2.0, shards are no longer time-bounded -->
<!-- This is to support cold-storage -->
<!-- Retention policies are more complicated -->

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

