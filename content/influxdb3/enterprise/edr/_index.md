---
title: Edge Data Replication (EDR) for InfluxDB 3 Enterprise
description: >
  Edge Data Replication (EDR) provides durable, observable, at-least-once
  replication of time series data from InfluxDB 3 Enterprise to InfluxDB 3
  Enterprise, InfluxDB 3 Cloud, or AWS Timestream for InfluxDB 3, over
  connections that might be intermittent or bandwidth-constrained.
menu:
  influxdb3_enterprise:
    name: Edge Data Replication
    identifier: edr
weight: 12
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/overview.md, docs/external/edr-spec.md -->

<!-- TODO(pm): confirm final disambiguation wording (title, lede, and
callout below). -->

Edge Data Replication (EDR) moves time series data
from edge InfluxDB 3 Enterprise instances up through regional relays to a
central hub, over links that might be intermittent or bandwidth-constrained.
EDR runs as a separate agent process alongside InfluxDB 3 Enterprise and
handles arbitrarily long disconnections—when the link comes back, data
catches up automatically.

> [!Note]
> #### Not the same as replication streams in InfluxDB v2 and InfluxDB Cloud
>
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
Cloud or AWS Timestream for InfluxDB 3—over connections that might be
intermittent, unreliable, or bandwidth-constrained.

| Property | Detail |
|-----|----|
| Delivery guarantee | At-least-once. Data is not lost during disconnection; data that outlives [write-ahead log (WAL)](/influxdb3/enterprise/edr/reference/glossary/#wal-write-ahead-log) retention is recovered from compacted files. |
| Ordering | WAL-file order preserved per ingest node (serial pipeline by default). |
| Direction | Push from upstream (source) to downstream (destination). The source initiates all transfers. |
| Wire format | Line Protocol over HTTP (default) or zstd-compressed [PT](/influxdb3/enterprise/reference/internals/storage-engine/#new-file-format) binary format (agent-to-agent, ~2.5x smaller). |
| Topology | Tree-shaped: edges to regionals to central. Each hop is independent. |
| Observability | Per-node UI, Prometheus metrics, JSON metrics API, Server-Sent Events (SSE) real-time updates. |

EDR is not a synchronous replication layer, a conflict resolution system, a
backup tool, or a transformation layer. For the full list of what EDR is and
isn't, see [Limitations](/influxdb3/enterprise/edr/reference/limitations/).

## Who EDR replicates between

EDR always replicates **from** InfluxDB 3 Enterprise. It replicates **to**:

- InfluxDB 3 Enterprise
- [InfluxDB 3 Cloud](/influxdb3/cloud/)
- AWS Timestream for InfluxDB 3

InfluxDB 3 Core, InfluxDB Cloud Serverless, InfluxDB Cloud Dedicated, and
InfluxDB Clustered are not supported as an EDR source or destination.

## Get started

- [Install EDR](/influxdb3/enterprise/edr/install/): Install the agent and CLI
  binaries.
- [Get started with EDR](/influxdb3/enterprise/edr/get-started/): Replicate between
  two InfluxDB 3 Enterprise instances on one host.
- [Run the signals demo](/influxdb3/enterprise/edr/demo/): A fuller 4-node topology.
- [Replicate with EDR](/influxdb3/enterprise/edr/replicate/): Configure replication to
  Enterprise, Cloud, or multiple destinations.
- [Monitor EDR](/influxdb3/enterprise/edr/monitor/): Watch replication health, lag, and
  progress.
- [Troubleshoot EDR](/influxdb3/enterprise/edr/troubleshoot/): Diagnose something that
  looks wrong.
- [Reference](/influxdb3/enterprise/edr/reference/): Architecture, configuration schema,
  CLI, API, and compatibility reference.

> [!Note]
> #### Getting EDR
>
> Edge Data Replication requires coordination with InfluxData.
> [Contact the InfluxData Sales team]({{< cta-link >}}) to discuss your replication requirements and deployment.

<a class="btn" href="/influxdb3/enterprise/edr/get-started/">Get started with EDR</a>
