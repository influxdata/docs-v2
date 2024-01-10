---
title: InfluxDB v3 Storage engine architecture
description: >
  ...
weight: 103
menu:
  influxdb_cloud_dedicated:
    name: Storage engine architecture
    parent: InfluxDB internals
influxdb/cloud-dedicated/tags: [storage, internals]
---

The InfluxDB v3 storage engine is a real-time, columnar database optimized for
time series data built in [Rust](https://www.rust-lang.org/) on top of
[Apache Arrow](https://arrow.apache.org/) and
[DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).
It supports infinite tag cardinality (number of unique tag values), real-time
queries, and is optimized to reduce storage cost.

- [Storage engine diagram](#storage-engine-diagram)
- [Storage engine components](#storage-engine-components)

## Storage engine diagram

{{< svg "/static/svgs/v3-storage-architecture.svg" >}}

## Storage engine components

- [Ingester](#ingester)
- [Querier](#querier)
- [Catalog](#catalog)
- [Object store](#object-store)
- [Compactor](#compactor)

### Ingester

- Handle all write requests
- Queries the [Catalog](#catalog) to identify where data should be persisted and to ensure
  the schema of the written data matches the schema of persisted data.
- Process line protocol and persists time series data into partitions in the object store
- Makes yet-to-be-persisted data available to queriers to ensure leading edge
  data is included in query results
- Maintains a short-term write-ahead log (WAL) to prevent data loss in case of a
  service interruption.

### Querier

- Handle on query requests.
- Support both SQL and InfluxQL through DataFusion.
- Retrieve the following:
  - Yet-to-be-persisted time series data from the [Ingesters](#ingester).
  - Physical locations of partitions containing queried data from the [Catalog](#catalog).
  - Time series data from parquet files in the [Object store](#object-store).

### Catalog

A relational database that stores and provides information about the physical
location of partitions and the schema of persisted time series data.

- Tells the ingesters what partitions to persist data to
- Tells the queriers what partitions contain the queried data.

### Object store

- Stores persisted time series data in [Apache Parquet](https://parquet.apache.org/) format.
- Each parquet file is a separate _partition_.
- By default, InfluxDB partitions data by measurement and day, but you can
  [customize the partitioning strategy](/influxdb/cloud-dedicated/admin/custom-partitions/).

### Compactor

- Compactors process and compress partitions in the object store to continually optimize
storage.
- Update the catalog with locations of compacted data.