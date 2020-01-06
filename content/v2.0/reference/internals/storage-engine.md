---
title: InfluxDB storage engine
description: >
  An overview of the InfluxDB storage engine architecture.
weight: 7
menu:
  v2_0_ref:
    name: Storage engine
    parent: InfluxDB Internals
v2.0/tags: [storage, internals]
---

The InfluxDB storage engine ensures that

- Data is safely written to disk
- Queried data is returned complete and correct
- Data is accurate (first) and performant (second)

This document outlines the internal workings of the storage engine.
This information is presented both as a reference and to aid those looking to maximize performance.

Major topics include:

* [Write Ahead Log (WAL)](#write-ahead-log-wal)
* [Cache](#cache)
* [Time-Structed Merge Tree (TSM)](#time-structured-merge-tree-tsm)
* [Time Series Index (TSI)](#time-series-index-tsi)

## Writing data: from API to disk

The storage engine handles data from the point an API write request is received through writing data to the physical disk.
Data is written to InfluxDB using [line protocol](/v2.0/reference/line-protocol/) sent via HTTP POST request to the `/write` endpoint.
Batches of [points](/v2.0/reference/glossary/#point) are sent to InfluxDB, compressed, and written to a WAL for immediate durability.
Points are also written to an in-memory cache and become immediately queryable.
The cache is periodically written to disk in the form of [TSM](#time-structured-merge-tree-tsm) files.
As TSM files accumulate, they are combined and compacted into higher level TSM files.

Points can be sent individually; however, for efficiency, most applications send points in batches.
Points in a POST body can be from an arbitrary number of series, measurements, and tag sets.
Points in a batch do not have to be from the same measurement or tagset.

## Write Ahead Log (WAL)

The **Write Ahead Log** (WAL) ensures durability by retaining data when the storage engine restarts.
It ensures that written data does not disappear in an unexpected failure.
When a client sends a write request, the following steps occur:

1. Append write request to the end of the WAL file.
2. Write data to disk using `fsync()`.
3. Update the in-memory cache.
4. Return success to caller.

`fsync()` takes the file and pushes pending writes all the way to the disk.
As a system call, `fsync()` has a kernel context switch which is computationally expensive, but guarantees that data is safe on disk.

{{% note%}}
Once you receive a response to a write request, your data is on disk!
{{% /note %}}

When the storage engine restarts, the WAL file is read back into the in-memory database.
InfluxDB then answers requests to the `/read` endpoint.

## Cache

The **cache** is an in-memory copy of data points currently stored in the WAL.
Points are organized by key, which is the measurement, tag set, and unique field.
Each field is stored in its own time-ordered range.
Data is not compressed in the cache.
The cache is recreated on restart by re-reading the WAL files on disk back into memory.
The cache is queried at runtime and merged with the data stored in TSM files.
When the storage engine restarts, WAL files are re-read into the in-memory cache.

Queries to the storage engine will merge data from the cache with data from the TSM files.
Queries execute on a copy of the data that is made from the cache at query processing time.
This way writes that come in while a query is running do not affect the result.
Deletes sent to the cache will clear out the given key or the specific time range for the given key.

## Time-Structured Merge Tree (TSM)

To efficiently compact and store data,
the storage engine groups field values by series key, and then orders those field values by time.
(A [series key](/v2/) is defined by measurement, tag key and value, and field key.)

The storage engine uses a **Time-Structured Merge Tree** (TSM) data format.
TSM files store compressed series data in a columnar format.
To improve efficiency, the storage engine only stores differences (or *deltas*) between values in a series.
Column-oriented storage means we can read by series key and ignore what it doesn't need.
Storing data in columns lets the storage engine read by series key.

After fields are stored safely in TSM files, the WAL is truncated and the cache is cleared.
The TSM compaction code is quite complex.
However, the high-level goal is quite simple:
organize values for a series together into long runs to best optimize compression and scanning queries.

## Time Series Index (TSI)

As data cardinality (the number of series) grows, queries read more series keys and become slower.
The **Time Series Index** ensures queries remain fast as data cardinality grows.
To keep queries fast as we have more data, we use a **Time Series Index**.

TSI stores series keys grouped by measurement, tag, and field.
In data with high cardinality (a large quantity of series), it becomes slower to search through all series keys.
The TSI stores series keys grouped by measurement, tag, and field.
TSI answers two questions well:
1) What measurements, tags, fields exist?
2) Given a measurement, tags, and fields, what series keys exist?
