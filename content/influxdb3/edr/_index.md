---
title: Edge Data Replication (EDR) for InfluxDB 3 Enterprise
description: >
  Edge Data Replication (EDR) provides durable, observable, at-least-once
  replication of time series data from InfluxDB 3 Enterprise to InfluxDB 3
  Enterprise, InfluxDB 3 Cloud, or AWS Timestream for InfluxDB 3, over
  connections that may be intermittent or bandwidth-constrained.
menu:
  influxdb3_edr:
    name: EDR
weight: 1
cascade:
  product: influxdb3_edr
  version: edr
---

<!-- TODO(pm): confirm final disambiguation wording (title, lede, and
callout below) — see PLAN.md §9 item 10. —>

Edge Data Replication (EDR) for InfluxDB 3 Enterprise moves time series data
from edge InfluxDB 3 Enterprise instances up through regional relays to a
central hub, over links that may be intermittent or bandwidth-constrained.
EDR runs as a separate agent process alongside InfluxDB 3 Enterprise and
handles arbitrarily long disconnections—when the link comes back, data
catches up automatically.

> [!Note]
> #### Not the same as InfluxDB v2/Cloud's replication streams
> This EDR product for InfluxDB 3 Enterprise is unrelated to
> [Edge Data Replication in InfluxDB v2 and InfluxDB Cloud](/influxdb/v2/write-data/replication/),
> which forwards writes from a local OSS bucket to a remote bucket. The two
> features share a name and general category (edge-to-cloud replication) but
> have different architectures, guarantees, and configuration. If you're
> looking for bucket-level write forwarding in InfluxDB v2 or Cloud, see
> [Edge Data Replication](/influxdb/v2/write-data/replication/) in the
> InfluxDB v2 documentation instead.

## What is EDR?

EDR provides durable, observable replication of time series data between
InfluxDB 3 Enterprise instances—and from InfluxDB 3 Enterprise to InfluxDB 3
Cloud or AWS Timestream for InfluxDB 3—over connections that may be
intermittent, unreliable, or bandwidth-constrained.

| Property | Detail |
|-----|----|
| Delivery guarantee | At-least-once. Data is not lost during disconnection; data that outlives WAL retention is recovered from compacted files. |
| Ordering | WAL-file order preserved per ingest node (serial pipeline by default). |
| Direction | Push from upstream (source) to downstream (destination). The source initiates all transfers. |
| Wire format | Line Protocol over HTTP (default) or PT+zstd binary format (agent-to-agent, ~2.5x smaller). |
| Topology | Tree-shaped: edges to regionals to central. Each hop is independent. |
| Observability | Per-node UI, Prometheus metrics, JSON metrics API, SSE real-time updates. |

EDR is not a synchronous replication layer, a conflict resolution system, a
backup tool, or a transformation layer. For the full list of what EDR is and
isn't, see [Limitations](/influxdb3/edr/reference/limitations/).

## Who EDR replicates between

EDR always replicates **from** InfluxDB 3 Enterprise. It replicates **to**:

- InfluxDB 3 Enterprise
- [InfluxDB 3 Cloud](/influxdb3/cloud/)
- AWS Timestream for InfluxDB 3

InfluxDB 3 Core, InfluxDB Cloud Serverless, InfluxDB Cloud Dedicated, and
InfluxDB Clustered are not supported as an EDR source or destination.

## Get started

- [Get started with EDR](/influxdb3/edr/get-started/): Learn the core
  concepts and run the 4-node demo.
- [Manage EDR](/influxdb3/edr/admin/): Install, configure, and operate EDR.
- [Reference](/influxdb3/edr/reference/): Architecture, configuration schema,
  CLI, API, and compatibility reference.

<a class="btn" href="/influxdb3/edr/get-started/">Get started with EDR</a>
