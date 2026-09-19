---
title: EDR architecture
description: >
  The EDR sidecar agent model, its components, deployment topology shapes,
  and the replication pipeline that moves data from source to destination.
menu:
  influxdb3_edr:
    name: Architecture
    parent: Reference
weight: 201
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/edr-spec.md, docs/external/overview.md -->

1. [External sidecar agent](#external-sidecar-agent)
2. [Storage engine terms](#storage-engine-terms)
3. [Two timestamps](#two-timestamps)
4. [The replication pipeline](#the-replication-pipeline)

## External sidecar agent

EDR runs as a separate process (`influxdb3-edr`) alongside InfluxDB 3
Enterprise, reading the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)'s
object store directly. The InfluxDB binary itself is unmodified.

<!-- Regenerated as Mermaid from the source's hand-authored inline SVG
(docs/external/overview.md); the two-cluster box-and-arrow shape translates
cleanly to a flowchart with subgraphs. -->
{{< diagram natural-size center >}}
flowchart TB
  subgraph SRC["Source Node"]
    direction LR 
    S1["InfluxDB 3 Enterprise"] -- "shared object store" --> S2["EDR Agent"]
  end
  subgraph DST["Destination Node"]
    direction LR
    D1["EDR Agent"] --> D2["InfluxDB 3"]
  end
  SRC -- "HTTP POST (EDRP)" --> DST 
{{< /diagram >}}

### Components

- **EDR Agent** (`influxdb3-edr`)—the replication process. One per node.
  Depending on configuration, one agent process acts as:
  - **Upstream facet** (source role)—reads the local InfluxDB instance's
    upgraded-storage-engine object store (WAL files, snapshots, compacted
    files), maintains replication state, and pushes data to a downstream
    destination.
  - **Downstream facet** (sink role)—receives data from one or more
    configured upstream agents and writes it to the local InfluxDB instance
    using a per-upstream write token.
  - **Combined**—both facets in one process, for hierarchical topologies
    where a regional node receives from edges and forwards to a central
    node.
- **Token Store**—a directory of secret files for authentication. See
  [Manage tokens](/influxdb3/edr/manage-tokens/).
- **Config File**—YAML defining topology, scope, and behavior. See
  [Configuration file reference](/influxdb3/edr/reference/config-file/).
- **Object Store**—the InfluxDB data directory (local filesystem, or
  S3, GCS, or Azure through `--object-store-type`). The agent reads it
  through the standard `ObjectStore` abstraction, so local filesystem,
  S3, GCS, and Azure backends are all supported.

Multi-node InfluxDB sources are supported—each ingest node's WAL stream is
tracked independently; multi-node sources require `idempotent_writes: true`.
The memory store is not supported as a source—EDR requires durable storage
to guarantee replication state persistence and at-least-once delivery.

### Deployment shapes

```
Edge -> Regional -> Central          (hierarchical, any depth)
Edge -> Central                      (direct)
Node A <-> Node B                    (peer-to-peer, bidirectional)
Edge -> InfluxDB 3 (no agent)        (direct mode, plain v3 write API)
```

- **Hierarchical**—a combined agent at the regional node receives from
  upstream edges and forwards onward. Each hop has its own independent
  configuration (scope, priorities, bandwidth schedule, credentials).
  There's no architectural depth limit; practical deployments are 2-3
  levels.
- **Peer-to-peer**—two nodes can each configure the other as their
  downstream, giving bidirectional replication. Scope filtering on each
  sender prevents circular amplification—each side replicates only its
  locally-owned databases and tables, so data received from the peer is
  not echoed back.
- **Direct mode**—the upstream agent can write straight to a plain
  InfluxDB 3 instance using the InfluxDB v3 write API, with no downstream
  agent. This sacrifices the agent-to-agent protocol's PT wire format,
  topology, and health reporting, but requires nothing at the destination
  beyond a write token. See
  [Configuration file reference](/influxdb3/edr/reference/config-file/#direct-mode).

## Storage engine terms

EDR reads the files that InfluxDB 3 Enterprise's
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
writes. These terms appear throughout the EDR documentation:

- **WAL (write-ahead log)**—the durable record of recent writes, flushed to
  the object store roughly every second. EDR's live path replicates WAL
  files. See
  [WAL](/influxdb3/edr/reference/glossary/#wal-write-ahead-log).
- **PT**—the upgraded storage engine's columnar file format (`.pt` files).
  EDR can send PT blocks on the wire without decoding rows. See
  [New file format](/influxdb3/enterprise/reference/internals/storage-engine/#new-file-format).
- **Gen0**—the first compaction generation, produced from WAL data. See
  [Gen0](/influxdb3/enterprise/reference/storage-engine-config-options/#gen0).
- **cv2**—compacted files at levels L1 and above. The compactor organizes
  them into fixed 24-hour UTC windows, so they're partitioned by data date.
  They're the primary medium for data whose gen0 files and snapshot
  manifests have already been compacted away. See
  [Compactor](/influxdb3/enterprise/reference/storage-engine-config-options/#compactor).
- **`.ptsnap`**—snapshot manifests. Each records the `last_wal` ID its
  snapshot covers, which is how EDR computes the snapshot boundary.

## Two timestamps

EDR distinguishes two timestamps throughout, and they must never be
confused:

| Term | Meaning | Monotonic? |
|---|---|---|
| **Data timestamp** | When the event occurred (the `time` column). | No—writers can write any timestamp, past or future. |
| **Ingest time** | When InfluxDB received the write. | Yes, within a node. |

The boundary that divides historic fill from live replication is defined in
WAL-ID space, which is ingest time.
The `historic_fill.since` threshold is a data-timestamp filter. See
[Historic fill](/influxdb3/edr/monitor/historic-and-gap-fill/#historic-fill).

## The replication pipeline

The upstream facet runs a pipeline of cooperating tasks.
Three producers—the WAL Replicator, Historic Fill, and Gap Fill—feed a
Tiered File Queue: one first-in, first-out (FIFO) queue per tier, where a
tier is one distinct priority value (see [Priorities](#priorities)).
The queue applies backpressure, so a producer slows when its tier fills.
A Tiered Dispatcher drains that queue with deficit round-robin (DRR)
scheduling and file-atomic dispatch, then encodes and sends each bundle
downstream.

### WAL replicator (live path)

#### Starting point: the snapshot boundary

- At startup, the agent computes the snapshot boundary once: for each
  ingest node, the `last_wal` ID recorded in the most recent `.ptsnap`
  manifest.
- The WAL replicator reads only from this boundary upward, not from the
  leading edge and not from independent discovery.
  Everything below the boundary belongs to
  [historic fill](/influxdb3/edr/monitor/historic-and-gap-fill/#historic-fill).
  Whether historic fill actually backfills that range depends on the
  configured `historic_fill` mode.
- Historic fill and the WAL replicator run concurrently, each on its own
  side of the boundary.
  Because the agent computes the boundary once in its main startup path
  and shares it with both producers, the division of work is
  deterministic—no race between them introduces a gap or an overlap.
- On subsequent startups, the replicator resumes from its persisted
  cursor.

#### Polling and per-file processing

The WAL replicator polls the object store (default every 1000 ms,
configurable through `poll_interval_ms`) for new WAL files per ingest
node. For each file it:

1. Extracts block references (database, table, data-time range, byte
   range) from the WAL file's block headers—no row decoding at this
   stage.
2. Evaluates each block against the replication scope, dropping
   out-of-scope blocks, and against the priority rules, assigning each
   in-scope block a priority and so a tier.
3. Groups the file's in-scope blocks by tier and emits one FileBundle per
   tier.

### File-atomic dispatch

A **FileBundle** is the unit of dispatch: all in-scope blocks of one
source file destined for one tier.
The dispatcher never interleaves blocks from different files within a
send.
A file's replication cursor entry completes only when all of its bundles,
across all tiers, have completed.

A WAL file whose blocks match different priority rules splits into one
bundle per tier.
High-priority blocks do not promote the whole file, and a full
low-priority tier does not block the high-priority bundle: bundles enter
the queue highest-tier first, and each tier has independent capacity and
backpressure.

The **TieredFileQueue** holds one FIFO queue per priority tier.
The **TieredDispatcher** takes bundles from those queues using deficit
round-robin (DRR) across tiers.
Each tier has a configurable share weight.
An empty tier's deficit resets, and the dispatcher redistributes its
capacity to non-empty tiers (work-stealing).
With no priority configuration, the queue degenerates to a single plain
FIFO with no quality-of-service (QoS) overhead.

For each bundle it takes, the dispatcher acquires a concurrency permit,
encodes the bundle's blocks, and sends one HTTP POST.
The default permit count is 1, which gives strict-order delivery.
`concurrent_sends > 1` requires `idempotent_writes: true`, because
out-of-order arrival silently reverts overwrites under last-write-wins.

Completion accounting is per file.
A counter tracks completed bundles against the file's expected bundle
count.
When all bundles complete, the replication cursor advances contiguously,
high-water-mark style, even when concurrent files complete out of order.
Failures are recorded: a file with a failed bundle still completes its
accounting, with the failure flagged.
Sends are retried with exponential backoff, per the `retry` configuration.

Delivery confirmation is optional: bundles can carry a confirmation
channel.
The channel signals historic fill and gap fill that the downstream
accepted a specific file's data.
They mark the corresponding work-list entry done only after that signal.
For files that split into multiple bundles, the confirmation fires when
the last bundle completes.

### Priorities

Priority rules form an ordered, first-match-wins list.
Each rule matches a scope (all, a database, or specific tables) and,
optionally, a data-time recency window (for example, "within the last
1h").
Each rule assigns a numeric priority (1-255, lower is more urgent).

Unique priority values become dispatch tiers.
An optional per-rule `share` weight sets the tier's DRR share.
One rule can claim historic fill traffic for its tier with
`historic_fill: true`; otherwise historic fill uses the lowest-priority
tier.

The dispatcher schedules across tiers by weighted sharing with DRR,
not by strict ordering that can starve lower tiers.
Lower tiers make progress in proportion to their share,
even while high-priority traffic flows.

Reordering across files means a restart can re-send data that the
file-granular cursor can't account for.
That's why priority routing requires `idempotent_writes: true`.
See
[Configuration file reference](/influxdb3/edr/reference/config-file/#priorities)
for the field schema.

### Wire format

Set the `encoding` config field to one of two wire encodings:

- **`lp`**—Line Protocol text, gzip-compressed in transport. Universal;
  required for direct mode and any non-agent destination.
- **`pt`**—PT blocks with schema front matter, zstd-compressed.
  Agent-to-agent only. Approximately 2.5x bandwidth reduction over LP.
  Block data flows from the source object store to the wire without
  decoding and re-encoding rows.

With either encoding, the destination applies writes idempotently:
re-delivering the same rows converges to the same state (last-writer-wins
on an identical series key and timestamp).
