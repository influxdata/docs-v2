---
title: InfluxDB 3 storage engine architecture
description: >
  The InfluxDB 3 storage engine is a real-time, columnar database optimized for
  time series data that supports infinite tag cardinality, real-time queries,
  and is optimized to reduce storage cost.
weight: 103
menu:
  influxdb3_clustered:
    name: Storage engine architecture
    parent: InfluxDB internals
influxdb3/clustered/tags: [storage, internals]
related:
  - /influxdb3/clustered/admin/scale-cluster/
  - /influxdb3/clustered/admin/custom-partitions/
---

The InfluxDB 3 storage engine is a real-time, columnar database optimized for
time series data built in [Rust](https://www.rust-lang.org/) on top of
[Apache Arrow](https://arrow.apache.org/) and
[DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).
It supports infinite tag cardinality (number of unique tag values), real-time
queries, and is optimized to reduce storage cost.

- [Storage engine diagram](#storage-engine-diagram)
- [Storage engine components](#storage-engine-components)
  - [Router](#router)
  - [Ingester](#ingester)
  - [Querier](#querier)
  - [Catalog](#catalog)
  - [Object store](#object-store)
  - [Compactor](#compactor)
  - [Garbage collector](#garbage-collector)

## Storage engine diagram

{{< svg "/static/svgs/v3-storage-architecture.svg" >}}

## Storage engine components

- [Router](#router)
- [Ingester](#ingester)
- [Querier](#querier)
- [Catalog](#catalog)
- [Object store](#object-store)
- [Compactor](#compactor)
- [Garbage collector](#garbage-collector)

### Router

The Router (also known as the Ingest Router) parses incoming line
protocol and then routes it to [Ingesters](#ingester).
To ensure write durability, the Router replicates data to two or more of the
available Ingesters.

### Ingester

The Ingester processes line protocol submitted in write requests and persists
time series data to the [Object store](#object-store).
In this process, the Ingester does the following:

- Queries the [Catalog](#catalog) to identify where data should be persisted and
  to ensure the schema of the line protocol is compatible with the
  [schema](/influxdb3/clustered/reference/glossary/#schema) of persisted data.
- Accepts or [rejects](/influxdb3/clustered/write-data/troubleshoot/#troubleshoot-rejected-points)
  points in the write request and generates a [response](/influxdb3/clustered/write-data/troubleshoot/).
- Processes line protocol and persists time series data to the
  [Object store](#object-store) in Apache Parquet format. Each Parquet file
  represents a _partition_--a logical grouping of data.
- Makes [yet-to-be-persisted](/influxdb3/clustered/reference/internals/durability/#data-ingest)
  data available to [Queriers](#querier) to ensure leading edge data is included
  in query results.
- Maintains a short-term [write-ahead log (WAL)](/influxdb3/clustered/reference/internals/durability/)
  to prevent data loss in case of a service interruption.

### Querier

The Querier handles query requests and returns query results for requests.
It supports both SQL and InfluxQL through
[Apache Arrow DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).

#### Query life cycle

At query time, the querier:

1.  Receives the query request and builds a query plan.
2.  Queries the [Ingesters](#ingester) to:

    - ensure the schema assumed by the query plan matches the schema of written data
    - include recently written, [yet-to-be-persisted](/influxdb3/clustered/reference/internals/durability/#data-ingest)
      data in query results

3.  Queries the [Catalog service](#catalog-service) to retrieve [Catalog store](#catalog-store)
    information about partitions in the [Object store](#object-store)
    that contain the queried data.
4.  Reads partition Parquet files that contain the queried data and scans each
    row to filter data that matches predicates in the query plan.
5.  Performs any additional operations (for example: deduplicating, merging, and sorting)
    specified in the query plan.
6.  Returns the query result to the client.

### Catalog

InfluxDB's catalog system consists of two distinct components: the [Catalog store](#catalog-store)
and the [Catalog service](#catalog-service).

> [!Note]
> The Catalog service is managed through the `AppInstance` resource, while the Catalog store 
> is managed separately according to your PostgreSQL implementation.

#### Catalog store

The Catalog store is a PostgreSQL-compatible relational database that stores metadata
related to your time series data including schema information and physical
locations of partitions in the [Object store](#object-store).
It fulfills the following roles:

- Provides information about the schema of written data.
- Tells the [Ingester](#ingester) what partitions to persist data to.
- Tells the [Querier](#querier) what partitions contain the queried data. 

#### Catalog service

The Catalog service (iox-shared-catalog statefulset) is an IOx component that caches 
and manages access to the Catalog store.

### Object store

The Object store contains time series data in [Apache Parquet](https://parquet.apache.org/) format.
Each Parquet file represents a partition.
By default, InfluxDB partitions tables by day, but you can
[customize the partitioning strategy](/influxdb3/clustered/admin/custom-partitions/).
Data in each Parquet file is sorted, encoded, and compressed.

### Compactor

The Compactor processes and compresses partitions in the [Object store](#object-store)
to continually optimize storage.
It then updates the [Catalog](#catalog) with locations of compacted data.

### Garbage collector

The Garbage collector runs background jobs that evict expired or deleted data,
remove obsolete compaction files, and reclaim space in both the [Catalog](#catalog) and the
[Object store](#object-store).
