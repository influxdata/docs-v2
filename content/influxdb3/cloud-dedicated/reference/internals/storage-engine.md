---
title: InfluxDB 3 storage engine architecture
description: >
  The InfluxDB 3 storage engine is a real-time, columnar database optimized for
  time series data that supports infinite tag cardinality, real-time queries,
  and is optimized to reduce storage cost.
weight: 103
menu:
  influxdb3_cloud_dedicated:
    name: Storage engine architecture
    parent: InfluxDB internals
influxdb3/cloud-dedicated/tags: [storage, internals]
related:
  - /influxdb3/cloud-dedicated/admin/custom-partitions/
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
- [Scaling strategies](#scaling-strategies)
  - [Vertical scaling](#vertical-scaling)
  - [Horizontal scaling](#horizontal-scaling)

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

##### Router scaling strategies

The Router can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Horizontal scaling increases write throughput and is typically the most
effective scaling strategy for the Router.
Vertical scaling (specifically increased CPU) improves the Router's ability to
parse incoming line protocol with lower latency.

### Ingester

The Ingester processes line protocol submitted in write requests and persists
time series data to the [Object store](#object-store).
In this process, the Ingester does the following:

- Queries the [Catalog](#catalog) to identify where data should be persisted and
  to ensure the schema of the line protocol is compatible with the
  [schema](/influxdb3/cloud-dedicated/reference/glossary/#schema) of persisted data.
- Accepts or [rejects](/influxdb3/cloud-dedicated/write-data/troubleshoot/#troubleshoot-rejected-points)
  points in the write request and generates a [response](/influxdb3/cloud-dedicated/write-data/troubleshoot/).
- Processes line protocol and persists time series data to the
  [Object store](#object-store) in Apache Parquet format. Each Parquet file
  represents a _partition_--a logical grouping of data.
- Makes [yet-to-be-persisted](/influxdb3/cloud-dedicated/reference/internals/durability/#data-ingest)
  data available to [Queriers](#querier) to ensure leading edge data is included
  in query results.
- Maintains a short-term [write-ahead log (WAL)](/influxdb3/cloud-dedicated/reference/internals/durability/)
  to prevent data loss in case of a service interruption.

##### Ingester scaling strategies

The Ingester can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Horizontal scaling increases write throughput and is typically the most
effective scaling strategy for the Ingester.

### Querier

The Querier handles query requests and returns query results for requests.
It supports both SQL and InfluxQL through
[Apache Arrow DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).

#### Query life cycle

At query time, the querier:

1.  Receives the query request and builds a query plan.
2.  Queries the [Ingesters](#ingester) to:

    - ensure the schema assumed by the query plan matches the schema of written data
    - include recently written, [yet-to-be-persisted](/influxdb3/cloud-dedicated/reference/internals/durability/#data-ingest)
      data in query results

3.  Queries the [Catalog](#catalog) to find partitions in the [Object store](#object-store)
    that contain the queried data.
4.  Reads partition Parquet files that contain the queried data and scans each
    row to filter data that matches predicates in the query plan.
5.  Performs any additional operations (for example: deduplicating, merging, and sorting)
    specified in the query plan.
6.  Returns the query result to the client.

##### Querier scaling strategies

The Querier can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Horizontal scaling increases query throughput to handle more concurrent queries.
Vertical scaling improves the Querier's ability to process computationally intensive queries.

### Catalog

The Catalog is a PostgreSQL-compatible relational database that stores metadata
related to your time series data including schema information and physical
locations of partitions in the [Object store](#object-store).
It fulfills the following roles:

- Provides information about the schema of written data.
- Tells the [Ingester](#ingester) what partitions to persist data to.
- Tells the [Querier](#querier) what partitions contain the queried data.

##### Catalog scaling strategies

Scaling strategies available for the Catalog depend on the PostgreSQL-compatible
database used to run the catalog. All support [vertical scaling](#vertical-scaling).
Most support [horizontal scaling](#horizontal-scaling) for redundancy and failover.

### Object store

The Object store contains time series data in [Apache Parquet](https://parquet.apache.org/) format.
Each Parquet file represents a partition.
By default, InfluxDB partitions tables by day, but you can
[customize the partitioning strategy](/influxdb3/cloud-dedicated/admin/custom-partitions/).
Data in each Parquet file is sorted, encoded, and compressed.

##### Object store scaling strategies

Scaling strategies available for the Object store depend on the underlying
object storage services used to run the object store.
Most support [horizontal scaling](#horizontal-scaling) for redundancy, failover,
and increased capacity.

### Compactor

The Compactor processes and compresses partitions in the [Object store](#object-store)
to continually optimize storage.
It then updates the [Catalog](#catalog) with locations of compacted data.

##### Compactor scaling strategies

The Compactor can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Because compaction is a compute-heavy process, vertical scaling (especially
increasing the available CPU) is the most effective scaling strategy for the Compactor.
Horizontal scaling increases compaction throughput, but not as efficiently as
vertical scaling.

### Garbage collector

The Garbage collector runs background jobs that evict expired or deleted data,
remove obsolete compaction files, and reclaim space in both the [Catalog](#catalog) and the
[Object store](#object-store).

##### Garbage collector scaling strategies

The Garbage collector is not designed for distributed load and should _not_ be
scaled horizontally. The Garbage collector does not perform CPU- or
memory-intensive work, so [vertical scaling](#vertical-scaling) should only be
considered only if you observe very high CPU usage or if the container regularly
runs out of memory.

---

## Scaling strategies

The following scaling strategies can be applied to components of the InfluxDB 3
storage architecture.

> [!Note]
> 
> For information about scaling your {{< product-name >}} infrastructure,
> [contact InfluxData support](https://support.influxdata.com).

### Vertical scaling

Vertical scaling (also known as "scaling up") involves increasing the resources
(such as RAM or CPU) available to a process or system.
Vertical scaling is typically used to handle resource-intensive tasks that
require more processing power.

{{< html-diagram/scaling-strategy "vertical" >}}

### Horizontal scaling

Horizontal scaling (also known as "scaling out") involves increasing the number of
nodes or processes available to perform a given task.
Horizontal scaling is typically used to increase the amount of workload or
throughput a system can manage, but also provides additional redundancy and failover.

{{< html-diagram/scaling-strategy "horizontal" >}}
