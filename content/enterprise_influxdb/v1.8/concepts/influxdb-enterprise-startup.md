---
title: InfluxDB Enterprise startup process
description: >
  On startup, InfluxDB Enterprise starts all subsystems and services in a deterministic order.
menu:
  enterprise_influxdb_1_8_ref:
    weight: 10
    name: Startup process
    parent: Concepts
---

On startup, InfluxDB Enterprise starts all subsystems and services in the following order:

1. [TSDBStore](#tsdbstore)
2. [Monitor](#monitor)
3. [Cluster](#cluster)
4. [Precreator](#precreator)
5. [Snapshotter](#snapshotter)
6. [Continuous Query](#continuous-query)
7. [Announcer](#announcer)
8. [Retention](#retention)
9. [Stats](#stats)
10. [Anti-entropy](#anti-entropy)
11. [HTTP API](#http-api)

A **subsystem** is a collection of related services managed together as part of a greater whole.
A **service** is a process that provides specific functionality.

## Subsystems and services

### TSDBStore
The TSDBStore subsystem starts and manages the TSM storage engine.
This includes services such as the points writer (write), reads (query),
and [hinted handoff (HH)](/enterprise_influxdb/v1.8/concepts/clustering/#hinted-handoff).
TSDBSTore first opens all the shards and loads write-ahead log (WAL) data into the in-memory write cache.
If `influxd` was cleanly shutdown previously, there will not be any WAL data.
It then loads a portion of each shard's index.

{{% note %}}
#### Index versions and startup times
If using `inmem` indexing, InfluxDB loads all shard indexes into memory, which,
depending on the number of series in the database, can take time.
If using `tsi1` indexing, InfluxDB only loads hot shard indexes
(the most recent shards or shards currently being written to) into memory and
stores cold shard indexes on disk.
Use `tsi1` indexing to see shorter startup times.
{{% /note %}}

### Monitor
The Monitor service provides statistical and diagnostic information to InfluxDB about InfluxDB itself.
This information helps with database troubleshooting and performance analysis.

### Cluster
The Cluster service provides implementations of InfluxDB OSS v1.8 interfaces
that operate on an InfluxDB Enterprise v1.8 cluster.

### Precreator
The Precreator service creates shards before they are needed.
This ensures necessary shards exist before new time series data arrives and that
write-throughput is not affected the creation of a new shard.

### Snapshotter
The Snapshotter service routinely creates snapshots of InfluxDB Enterprise metadata.

### Continuous Query
The Continuous Query (CQ) subsystem manages all InfluxDB CQs.

### Announcer
The Announcer service announces a data node's status to meta nodes.

### Retention
The Retention service enforces [retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp)
and drops data as it expires.

### Stats
The Stats service monitors cluster-level statistics.

### Anti-entropy
The Anti-entropy (AE) subsystem is responsible for reconciling differences between shards.
For more information, see [Use anti-entropy](/enterprise_influxdb/v1.8/administration/anti-entropy/).

### HTTP API
The InfluxDB HTTP API service provides a public facing interface to interact with
InfluxDB Enterprise and internal interfaces used within the InfluxDB Enterprise cluster.

