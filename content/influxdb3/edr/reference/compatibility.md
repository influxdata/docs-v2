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

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/compatibility.md, docs/external/edr-spec.md -->

EDR has two compatibility dimensions.

> [!Important]
> #### Compatibility is binary
>
> Neither dimension has a partial mode. In a compatible pairing, live
> replication, historic fill, and gap recovery all work. An incompatible
> pairing refuses to start or halts loudly, and names the side that must
> change.

| Compatibility dimension | Compared components | Compatibility check | Incompatible behavior |
|---|---|---|---|
| Agent protocol | Two EDR agents on one replication hop. | Protocol v3 agents negotiate on every `/report`. Protocol v1 and v2 agents negotiate at `/connect`. | The upstream agent halts the replication hop. Both agents report their protocol versions. |
| Storage format | An EDR agent and the source InfluxDB 3 Enterprise store. | The agent checks the storage format at startup and while it runs. | The agent refuses to start with an incompatible store. If a running store becomes incompatible, the agent halts replication. |

<!-- VERIFIED against the EDR source and agent log output: the agent logs
`storage compatibility: COMPATIBLE` during a successful startup preflight
and `storage compatibility: INCOMPATIBLE` before refusing to start or
halting at runtime. `edr-inspect` never prints either label.
`/edr/v1/status` returns per-upstream protocol fields (`agent_version`,
`negotiated_protocol`, `protocol_refused`) and no storage verdict.
`/edr/v1/node_info` returns `compat.built_against`,
`supported_server_lines`, and nullable protocol and storage halt reasons;
it does not serialize the internal `StorageCompat` enum.
`influxdb3-edr --version` prints only the EDR version and Git SHA, for
example `1.0.0-0.rc.1 (085be6c69)`. -->

**Where to read compatibility information**: Run `influxdb3-edr --version`
to find the agent version and build SHA. Check the startup log for the
storage compatibility verdict and build matrix. Check connection logs or
`/edr/v1/status` for the protocol negotiated with each upstream agent.
Check `/edr/v1/node_info` for the supported InfluxDB server lines and
active compatibility halt reasons. Use `edr-inspect topology` and
`edr-inspect metrics` to assess the resulting channel health and
replication state.

## Supported destinations

EDR always replicates **from** InfluxDB 3 Enterprise. It replicates **to**:

- InfluxDB 3 Enterprise (agent-to-agent, full protocol and storage
  compatibility as described below)
- [InfluxDB 3 Cloud](/influxdb3/cloud/) (see
  [Replicate to InfluxDB 3 Cloud](/influxdb3/edr/replicate/to-cloud/))
- AWS Timestream for InfluxDB 3

<!-- TODO(pm): confirm AWS Timestream for InfluxDB 3 destination
stability at GA and the correct product name and link target from
AWS-facing docs before publishing this callout. -->
> [!Note]
> #### AWS Timestream for InfluxDB 3
>
> AWS Timestream for InfluxDB 3 is a supported EDR destination. AWS
> maintains this destination's own documentation; see AWS's documentation
> for AWS Timestream for InfluxDB 3 for setup and compatibility details
> specific to that destination.

InfluxDB 3 Core is **not** supported as an EDR source or destination.
InfluxDB Cloud Serverless, InfluxDB Cloud Dedicated, and InfluxDB Clustered
are also not supported as an EDR source or destination.

## EDR agent <-> EDR agent (wire protocol)

Directly connected agents negotiate a **protocol version** and a
**capability set** on each hop. Negotiation never propagates along a relay
chain, so a bad hop reports at that hop and the rest of the chain is
unaffected.

With the current minimums, **no released pairing can be refused**. The
first possible refusal requires a future release that deliberately raises
its minimum, and [release notes](/influxdb3/edr/release-notes/) will call
out that break.

For the protocol version matrix, what each version changed, the capability
registry, and what a refusal looks like on the wire, see
[Protocol version negotiation](/influxdb3/edr/reference/api/#protocol-version-negotiation).

## EDR agent <-> InfluxDB 3 Enterprise (storage formats)

The sender agent reads the source server's object store directly—WAL
files, snapshot manifests, compaction checkpoints, catalog. Compatibility
is therefore about **on-disk formats**, and the store itself is the
evidence: at startup the agent sniffs the newest artifacts and either
starts, logging `storage compatibility: COMPATIBLE`, or refuses with the
exact format mismatch and logs `storage compatibility: INCOMPATIBLE`.

| EDR release | InfluxDB 3 Enterprise 3.10.x | 3.11.x | newer |
|---|---|---|---|
| **0.1.0 / 0.2.0** | COMPATIBLE (built against 3.10.0) | INCOMPATIBLE | INCOMPATIBLE |
| **1.0.0-0.rc.1 and later** | COMPATIBLE | COMPATIBLE (built against 3.11.0) | INCOMPATIBLE until a release says otherwise |

The dual support is real, validated both ways: the full test suite and
chaos matrix run green against 3.10.5 and 3.11.0 stores. An out-of-matrix
pairing might *appear* to partly function—for example, 0.2.0
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

The formats behind the matrix, for operators who want the detail—see
[Storage engine terms](/influxdb3/edr/reference/architecture/#storage-engine-terms)
for what each one holds:

| Format | What EDR uses it for | Stability |
|---|---|---|
| `.pt` WAL files | live replication (block shipping) | unchanged 3.10 to 3.11 |
| `.ptsnap` snapshot manifests | snapshot boundary, historic planning | v3 across both lines |
| [Compaction](/influxdb3/enterprise/reference/internals/durability/#upgraded-storage-engine-compaction) checkpoints (`.ptv2chk`)—the cv2 tier | historic fill and gap recovery read compacted data once EDR's WAL replicator can no longer see it | **the moving part**: v9 (3.10) to v10 (3.11); newer versions are the usual cause of INCOMPATIBLE |
| Catalog | schema for encoding | versioned; compatibility tracked per release |

## Release <-> compatibility summary

Each entry in [Release notes](/influxdb3/edr/release-notes/) states both
lines for that release: the protocol version it speaks, and the InfluxDB
server lines its storage matrix covers, with the influxdb_pro revision it
was built against.
