---
title: EDR compatibility
description: >
  EDR's agent-to-agent protocol compatibility and agent-to-InfluxDB storage
  format compatibility matrices, and supported destinations.
menu:
  influxdb3_edr:
    name: Compatibility
    parent: Reference
weight: 206
---

EDR has two compatibility dimensions, and both are **binary**: a pairing is
COMPATIBLE or INCOMPATIBLE—there is no partial mode. Within a compatible
pairing, everything works; an incompatible pairing refuses to start or
halts loudly, and says exactly which side must change.

| Dimension | Between | Decided by | On incompatibility |
|---|---|---|---|
| Agent <-> agent | two EDR agents on one replication hop | protocol negotiation at `/connect` | upstream halts that hop; both sides name the versions |
| Agent <-> InfluxDB | an EDR agent and the InfluxDB 3 Enterprise store it reads | storage-format preflight + runtime checks | agent refuses to start, or halts if the store changes underneath it |

**Where to read versions**: `influxdb3-edr --version` (agent build + the
InfluxDB format line it was built against); the startup log (one line per
dimension); `/edr/v1/status` (negotiated protocol per upstream, storage
verdict); `edr-inspect topology` / `metrics`.

## Supported destinations

EDR always replicates **from** InfluxDB 3 Enterprise. It replicates **to**:

- InfluxDB 3 Enterprise (agent-to-agent, full protocol and storage
  compatibility as described below)
- [InfluxDB 3 Cloud](/influxdb3/cloud/) (see
  [Replicate to InfluxDB 3 Cloud](/influxdb3/edr/admin/replicate-to-cloud/))
- AWS Timestream for InfluxDB 3

<!-- TODO(pm): confirm AWS Timestream for InfluxDB 3 destination
stability at GA and the correct product name / link target from
AWS-facing docs before publishing this callout — see PLAN.md §9 item 3. -->
> [!Note]
> #### AWS Timestream for InfluxDB 3
> AWS Timestream for InfluxDB 3 is a supported EDR destination. AWS
> maintains this destination's own documentation; see AWS's documentation
> for AWS Timestream for InfluxDB 3 for setup and compatibility details
> specific to that destination.

InfluxDB 3 Core is **not** supported as an EDR source or destination.
InfluxDB Cloud Serverless, InfluxDB Cloud Dedicated, and InfluxDB Clustered
are also not supported as an EDR source or destination.

## EDR agent <-> EDR agent (wire protocol)

Directly connected agents negotiate a **protocol version** and a
**capability set**, per hop—never propagated along a relay chain (a bad
hop reports at that hop; the rest of the chain is unaffected).

- **Protocol v1** is defined retroactively: it is exactly the wire behavior
  of agents released before versioning existed (0.1.x / 0.2.x). Those
  agents send no version fields; absence is read as v1. Nothing about v1
  changed.
- **Protocol v2** (interim development builds; never in a released
  version) added the negotiation itself, carried on `/connect`.
- **Protocol v3** (current) is the **stateless data path**: the upstream's
  declaration rides every `/report` (in full) and every `/data` (as
  compact headers), and the downstream's declaration rides the `/report`
  response. Between v3 peers `/connect` is never sent, and `/data` needs no
  prior contact—any receiver instance can serve any request (the basis for
  receiver fault tolerance and load balancing). Negotiation is refreshed on
  every report.
- The agreement is **min(both versions)**, refused when that falls below
  either side's minimum. A pairing whose agreement lands below v3 runs the
  v2 connect-gated flow automatically—mixed fleets need no configuration.
- **Capabilities** gate optional features (the version gates wire-breaking
  changes). Registry: `pt-wire-1`—the PT wire format (`encoding: pt`). A
  downstream that lacks a capability the upstream's config requires is
  treated as incompatible, with the config key named.

| Upstream \ Downstream | 0.1.x / 0.2.x (v1) | interim dev builds (v2) | 1.0.0-0.rc.1+ (v3) |
|---|---|---|---|
| **0.1.x / 0.2.x** | v1 (implicit) | v1—accepted | v1—accepted |
| **interim dev builds** | v1—accepted | v2, connect-gated | v2, connect-gated |
| **1.0.0-0.rc.1+** | v1—accepted | v2, connect-gated | **v3, stateless** |

With the current minimums, **no released pairing can be refused**. The
first possible refusal requires a future release that deliberately raises
its minimum—a compatibility break that will be called out in release
notes.

**What incompatibility looks like** (future-skew or capability mismatch):
the downstream answers with HTTP 426 and a diagnosis naming both versions
and both minimums; the upstream **halts that hop**—nothing is sent, health
shows `Halted`, one ERROR at halt time, and a `PROTOCOL-HALTED` WARN every
minute. Because negotiation rides every report, the halt clears **within
one report interval** (default 10s) of the named agent being upgraded. See
[Troubleshoot EDR](/influxdb3/edr/troubleshoot/#protocol-incompatible-agents-of-different-versions).

## EDR agent <-> InfluxDB 3 Enterprise (storage formats)

The sender agent reads the source server's object store directly—WAL
files, snapshot manifests, compaction checkpoints, catalog. Compatibility
is therefore about **on-disk formats**, and the store itself is the
evidence: at startup the agent sniffs the newest artifacts and either
starts (COMPATIBLE) or refuses with the exact format mismatch
(INCOMPATIBLE). There is no partial mode: within a compatible pairing, live
replication, historic fill and gap recovery all work; nothing is silently
feature-reduced.

| EDR release | InfluxDB 3 Enterprise 3.10.x | 3.11.x | newer |
|---|---|---|---|
| **0.1.0 / 0.2.0** | COMPATIBLE (built against 3.10.0) | INCOMPATIBLE | INCOMPATIBLE |
| **1.0.0-0.rc.1 and later** | COMPATIBLE | COMPATIBLE (built against 3.11.0) | INCOMPATIBLE until a release says otherwise |

The dual support is real, validated both ways: the full test suite and
chaos matrix run green against 3.10.5 and 3.11.0 stores. An out-of-matrix
pairing may *appear* to partly function—for example, 0.2.0
live-replicating from a 3.11 store—but it is not a supported mode and
recovery paths will fail.

**If the source server is upgraded underneath a running agent** past the
agent's matrix, the agent **halts everything, loudly**—same discipline as
a protocol halt: ERROR with the observed vs supported format versions, a
per-minute WARN, health `Halted`, and an hourly re-probe (covers a server
rollback; an EDR upgrade restarts the agent anyway). Replication backlog
during the halt is **owed work, not loss**: after upgrading EDR, the WAL
tail drains normally and anything the source evicted meanwhile is
recovered through the compacted files.

**Upgrade order**: upgrade the **reader first**—EDR before the source
server. A 1.0.0-0.rc.1 agent runs against 3.10 today and keeps running
across the server's 3.10 to 3.11 upgrade; upgrading the server first (past
the matrix) halts replication until EDR catches up.

The formats behind the matrix, for operators who want the detail:

| Format | What EDR uses it for | Stability |
|---|---|---|
| `.pt` WAL files | live replication (block shipping) | unchanged 3.10 to 3.11 |
| `.ptsnap` snapshot manifests | snapshot boundary, historic planning | v3 across both lines |
| [Compaction](/influxdb3/enterprise/reference/internals/durability/#upgraded-storage-engine-compaction) checkpoints (`.ptv2chk`) | historic fill + gap recovery read compacted data once EDR's WAL replicator can no longer see it | **the moving part**: v9 (3.10) to v10 (3.11); newer versions are the usual cause of INCOMPATIBLE |
| Catalog | schema for encoding | versioned; compatibility tracked per release |

## Release <-> compatibility summary

Each entry in [Release notes](/influxdb3/edr/release-notes/) states both
lines for that release: the protocol version it speaks, and the InfluxDB
server lines its storage matrix covers, with the influxdb_pro revision it
was built against.
