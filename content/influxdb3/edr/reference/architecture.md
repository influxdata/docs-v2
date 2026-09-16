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

1. [External sidecar agent](#external-sidecar-agent)
2. [Two timestamps](#two-timestamps)
3. [The replication pipeline](#the-replication-pipeline)

## External sidecar agent

EDR runs as a separate process (`influxdb3-edr`) alongside InfluxDB 3
Enterprise, reading the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)'s
object store directly. The InfluxDB binary itself is unmodified.

<!-- Regenerated as Mermaid from the source's hand-authored inline SVG
(docs/external/overview.md); the two-cluster box-and-arrow shape translates
cleanly to a flowchart with subgraphs. -->
{{< diagram >}}
flowchart LR
  subgraph SRC["Source Node"]
    direction LR
    S1["InfluxDB 3 Enterprise"] -- "shared object store" --> S2["EDR Agent"]
  end
  subgraph DST["Destination Node"]
    direction LR
    D1["EDR Agent"] --> D2["InfluxDB 3"]
  end
  S2 -- "HTTP POST (EDRP)" --> D1
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
  S3/GCS/Azure via `--object-store-type`). The agent reads it through the
  standard `ObjectStore` abstraction, so local filesystem, S3, GCS, and
  Azure backends are all supported.

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
- **Peer-to-peer**—two nodes may each configure the other as their
  downstream, giving bidirectional replication. Scope filtering on each
  sender prevents circular amplification—each side replicates only its
  locally-owned databases/tables, so data received from the peer is not
  echoed back.
- **Direct mode**—the upstream agent can write straight to a plain
  InfluxDB 3 instance using the InfluxDB v3 write API, with no downstream
  agent. This sacrifices the agent-to-agent protocol's PT wire format,
  topology, and health reporting, but requires nothing at the destination
  beyond a write token. See
  [Configuration file reference](/influxdb3/edr/reference/config-file/#direct-mode).

## Two timestamps

EDR distinguishes two timestamps throughout, and they must never be
confused:

| Term | Meaning | Monotonic? |
|---|---|---|
| **Data timestamp** | When the event occurred (the `time` column). | No—writers can write any timestamp, past or future. |
| **Ingest time** | When InfluxDB received the write. | Yes, within a node. |

The historic/live replication boundary is defined in WAL-ID / ingest-time
space. The `historic_fill.since` threshold is a data-timestamp filter. See
[Historic fill](/influxdb3/edr/monitor/historic-and-gap-fill/#historic-fill).

## The replication pipeline

The upstream facet runs a pipeline of cooperating tasks: three
producers—the WAL Replicator, Historic Fill, and Gap Fill—feed a Tiered
File Queue (per-tier FIFO with backpressure), which a Tiered Dispatcher
drains with deficit round-robin (DRR) scheduling and file-atomic dispatch,
then encode, send, and downstream.

### WAL replicator (live path)

The WAL replicator polls the object store (default every 1000 ms,
configurable via `poll_interval_ms`) for new WAL files per ingest node. For
each file it:

1. Extracts block references (database, table, data-time range, byte
   range) from the WAL file's block headers—no row decoding at this
   stage.
2. Evaluates each block against the replication scope (out-of-scope blocks
   are dropped) and the priority rules (each in-scope block is assigned a
   priority, hence a tier).
3. Groups the file's in-scope blocks by tier and emits one FileBundle per
   tier.

**Starting point—the snapshot boundary.** At startup the agent computes,
once, the snapshot boundary: for each ingest node, the `last_wal` ID
recorded in the most recent `.ptsnap` manifest. The WAL replicator starts
from this boundary (not from the leading edge, and not from independent
discovery), and historic fill owns everything below it. Because the
boundary is computed once in the agent's main startup path and shared by
both subsystems, the historic/live handoff is deterministic—there is no
gap and no overlap introduced by races between the two. On subsequent
startups the replicator resumes from its persisted cursor.

### File-atomic dispatch

The unit of dispatch is the **FileBundle**: all in-scope blocks of one
source file destined for one tier. Blocks from different files are never
interleaved within a send, and a file's replication cursor entry completes
only when all of its bundles (across all tiers) have completed. A WAL file
whose blocks match different priority rules splits into one bundle per
tier; high-priority blocks do not promote the whole file, and a full
low-priority tier does not block the high-priority bundle (bundles are
pushed highest-tier first, and each tier has independent capacity and
backpressure).

The **TieredFileQueue** holds one FIFO queue per priority tier. The
**TieredDispatcher** pops bundles using deficit round-robin (DRR) across
tiers: each tier has a configurable share weight, an empty tier's deficit
resets and its capacity is redistributed to non-empty tiers
(work-stealing), and with no priority configuration the queue degenerates
to a single plain FIFO with no QoS overhead.

For each popped bundle the dispatcher acquires a concurrency permit
(default 1 = strict-order delivery; `concurrent_sends > 1` requires
`idempotent_writes: true`—out-of-order arrival silently reverts overwrites
under last-write-wins), encodes the bundle's blocks, and sends one HTTP
POST. Completion accounting is per file: a counter tracks completed bundles
against the file's expected bundle count; when all bundles complete, the
replication cursor advances (contiguously, high-water-mark style, even when
concurrent files complete out of order). Failures are recorded—a file with
a failed bundle still completes its accounting with the failure
flagged—and sends are retried with exponential backoff per the `retry`
configuration.

**Delivery confirmation**: bundles can carry a oneshot confirmation
channel. Historic fill and gap fill use this to learn that a specific
file's data was accepted by the downstream before marking the corresponding
work-list entry done. For files that split into multiple bundles, the
confirmation fires when the last bundle completes.

### Priorities

Priority rules are an ordered, first-match-wins list. Each rule matches a
scope (all / a database / specific tables), optionally a data-time recency
window (for example, "within the last 1h"), and assigns a numeric priority
(1-255, lower is more urgent). Unique priority values become dispatch
tiers; an optional per-rule `share` weight sets the tier's DRR share, and
one rule may claim historic fill traffic for its tier via
`historic_fill: true` (otherwise historic fill rides the lowest-priority
tier).

Scheduling across tiers is weighted sharing via DRR, not strict
starvation-prone ordering: lower tiers make progress in proportion to their
share even while high-priority traffic flows. Priority routing requires
`idempotent_writes: true`, because reordering across files means restart
can re-send data the file-granular cursor cannot account for. See
[Configuration file reference](/influxdb3/edr/reference/config-file/#priorities)
for the field schema.

### Wire format

Two encodings are supported (the `encoding` config field):

- **`lp`**—Line Protocol text, gzip-compressed in transport. Universal;
  required for direct mode and any non-agent destination.
- **`pt`**—PT blocks with schema front matter, zstd-compressed.
  Agent-to-agent only. Approximately 2.5x bandwidth reduction over LP.
  Block data flows from the source object store to the wire without
  decode/re-encode of rows.

In both encodings, writes are applied idempotently at the destination:
re-delivery of the same rows converges to the same state (last-writer-wins
on identical series key + timestamp).
