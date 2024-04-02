---
title: Monitor your cluster
seotitle: Monitor your InfluxDB Cloud Dedicated cluster
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 102
---

Use the Grafana dashboard provided by InfluxData to monitor your InfluxDB Cloud
Dedicated cluster.

To access the dashboard, visit.

The dashboard is divided into the following sections that visualize metrics
related to your cluster's health:

- [Query Tier Cpu/Mem](#query-tier-cpumem)
- [Query Tier](#query-tier)
- [Ingest Tier Cpu/Mem](#ingest-tier-cpumem)
- [Ingest Tier](#ingest-tier)
- [Compaction Tier Cpu/Mem](#compaction-tier-cpumem)
- [Compactor](#compactor)
- [Ingestor Catalog Operations](#ingestor-catalog-operations)
- [Catalog Operations Overview](#catalog-operations-overview)

### Query Tier Cpu/Mem

#### CPU Utilization (k8s)

CPU Utilization of query pods as reported by the Kubernetes container usage.

#### Memory Usage (k8s)

Memory usage of the query pod containers as reported by Kubernetes (via cgroup).

---

### Query Tier

#### gRPC Requests (ok)

Rate of gRPC requests for different endpoints that returned that status code "OK", summed across all queriers.

#### gRPC Requests (not ok)

Rate of gRPC requests for all endpoints that returned that status code other than "OK", summed across all queriers.

#### Request Duration (flight DoGet) (ok + !ok)

gRPC request duration heatmap for the DoGet endpoint combining both successes and failures. This is NOT filtered/grouped by status.

#### Successful Request Duration (flight DoGet)

gRPC request duration heatmap for the DoGet endpoint, showing only successes. This is filtered/grouped by status=ok.

#### Acquire Duration

Heatmap of "how long does a query wait until it passes the query semaphore". This only contains the time waiting for the semaphore, NOT the time holding it. This can be used to gauge how much query latency is added due to a high cluster load.

{{% note %}}
Metrics converning the so-called "query semaphore", such as Acquire Duration.

This semaphore limits the number of concurrent queries that can be processed. This is a self-protection mechanism since many data structures during query planning and execution are not accounted for and we want to prevent OOMs.

Queries that are waiting for the semaphore are running gRPC requests. The client does NOT know that/when a query is waiting for the semaphore.
{{% /note %}}

---

### Ingest Tier Cpu/Mem

- CPU Utilization Ingesters (k8s): CPU Utilization of ingester pods as reported by the Kubernetes container usage.
- Memory Usage Ingesters (k8s): This is the memory usage of the ingester pod containers as reported by Kubernetes (via cgroup).
- CPU Utilization Routers (k8s): CPU Utilization of router pods as reported by the Kubernetes container usage.
- Memory Usage Routers (k8s): This is the memory usage of the router pod containers as reported by Kubernetes (via cgroup).

---

### Ingest Tier

- Write Requests (at router): Number of write operations completed across all routers.
- LP Ingest (at router): Per router and total (sum) number of line protocol lines received
- LP Ingest (at router) _bytes_: Individual router and total (sum) bytes of line protocol received per second
- HTTP request error rate (server's POV at Router): Reported by the iox http request handler
- Healthy Upstream Ingesters per Router: Number of upstream ingesters each router believes is healthy.
  This reflects the router's RPC request balancer / circuit breaker state.

  Healthy upstream ingesters is indicating how many ingesters each router sees.
  A collapse of the ingest pipeline may be indicated by the routers not connecting
  to ingesters because of network issues or ingester unavailability.

  The Persist Queue is the queue for persisting, or saving to s3, new parquey files.
  The ingesters manage the persist queue. They create the L0 parquet files from
  their write buffer (WAL) and save it to S3. If the persist queue is growing it
  means the ingesters are not keeping up with the incoming write load, likely
  leading to ingester failure if it doesn't subside. Likewise, a increasing or
  large persist queue duration means parquet files are taking a long time to get
  to s3 because of network or internal ingester resource limitations.

- Persist Queue Depth: The number of persist jobs enqueued and not yet started.
- Persist Task Queue Duration: Duration of time a persist job spent in the queue before being executed.
- Ingester Disk Data Directory Usage: This displays the per pod disk usage as a
  percentage of ingester's data directory. When full, the write-ahead log will be unable to operate

  {{% note %}}
The WAL is stored on a disk attached to the ingesters. This disk could fill up if the WAL grows too large. This would cause the ingester to fail until disk space is made available.
  {{% /note %}}

- Ingest Blocked Time (24h): Percentage of time the persist system has been marked as saturated (rejecting writes).
- Max Persist Queue Depth: Maximum queue depth as a percentage of the configured
  maximum queue depth - once reached writes are rejected (persist saturation).
  Shows the ratio of the most saturated ingester.
- Write Logs (10 examples): These are 10 logs from the time period - they are not "the most recent 10".

---

### Compaction Tier Cpu/Mem

- CPU Utilization (k8s): CPU Utilization of compactor pods as reported by the Kubernetes container usage.
- Memory Usage (k8s): This is the memory usage of the ingester pod containers as reported by Kubernetes (via cgroup).

---

### Compactor

- Compactor: L0 File Counts (5m bucket width): Quantity of L0 files, at time of compaction.

Ingesters create parquet files called L0 (level zero) - they only create L0. Compactors create L1, L2, L3, etc by taking multiples of a lower level. For example, four L0 files could be compacted into one (or more) L1 files.

Parquet files are shared (segemented, partitioning) by timerange and partition (plus any custom partitioning). Once four L0 files accumulate for a partion/shard, those files are eligible for compaction by the compactor. Thus, if the compactor is keeping up as best as possible with the incoming write load and the L0 files, all compaction events will have exactly 4 files. This will mean the 0-4 y-axis of this heatmap is where most of the compaction starts occur.

Therefore, we can make some general assessments from this L0 count for compaction starts and infer how well or not the compactor is keeping up.

The L0 count is telling us how many partitions started a compaction with that many (y-axis) L0 parquet files during the x-axis interval. In other words, are partitions being compacted as soon as there are a few L0 parquet files? This chart allows us to determine if the compactor is starting compactions as soon as it can.

---

### Ingestor Catalog Operations

- Catalog Ops - success: Number of catalog operations requested by ingesters, per second.
- Catalog Ops - error: Number of catalog operations requested by ingesters, per second.
- Catalog Op Latency (P90): Per-operation P90 query latancy against the catalog service.
  When a P90 value is high, the catalog may be overloaded.

---

### Catalog Operations Overview

- Requests per Operation - success: Number of successful catalog requests by operation.
- Requests per Operation - error: Number of erred catalog requests by operation.
