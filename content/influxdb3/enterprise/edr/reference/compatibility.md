---
title: EDR compatibility
description: >
  EDR's agent-to-agent protocol compatibility and agent-to-InfluxDB storage
  format compatibility matrices, and supported destinations.
menu:
  influxdb3_enterprise:
    identifier: edr-compatibility
    name: Compatibility
    parent: edr-reference
weight: 206
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/compatibility.md, docs/external/edr-spec.md -->
<!-- GA_REVIEW: EDR 1.0.0 at fcdf286; release-specific updates reconciled with docs/external at c2f088e. Existing VERIFIED corrections take precedence over upstream prose. -->

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
  [Replicate to InfluxDB 3 Cloud](/influxdb3/enterprise/edr/replicate/to-cloud/))
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

## Compatibility between EDR agents (wire protocol)

Directly connected agents negotiate a **protocol version** and a
**capability set** on each hop. Negotiation never propagates along a relay
chain, so a bad hop reports at that hop and the rest of the chain is
unaffected.

With the current minimums, **no released pairing can be refused**. The
first possible refusal requires a future release that deliberately raises
its minimum, and [release notes](/influxdb3/enterprise/edr/release-notes/) will call
out that break.

For the protocol version matrix, what each version changed, the capability
registry, and what a refusal looks like on the wire, see
[Protocol version negotiation](/influxdb3/enterprise/edr/reference/api/#protocol-version-negotiation).

## Compatibility between EDR and InfluxDB 3 Enterprise (storage formats)

The sender agent reads the source server's object store directly—WAL
files, snapshot manifests, compaction checkpoints, catalog. Compatibility
is therefore about **on-disk formats**, and the store itself is the
evidence: at startup the agent sniffs the newest artifacts and either
starts, logging `storage compatibility: COMPATIBLE`, or refuses with the
exact format mismatch and logs `storage compatibility: INCOMPATIBLE`.

### Supported source server versions

The compatibility table lists the InfluxDB 3 Enterprise source server versions supported by each EDR release.

| EDR release | InfluxDB 3 Enterprise 3.10.x | 3.11.x | 3.12.x | Newer |
|---|---|---|---|---|
| 0.1.0 / 0.2.0 | Supported (built against 3.10.0) | Unsupported | Unsupported | Unsupported |
| 1.0.0-0.rc.1 | Supported | Supported (built against 3.11.0) | Unsupported | Unsupported |
| 1.0.0-0.rc.2 | Supported | Supported (built against 3.11.0) | Unsupported | Unsupported |
| 1.0.0-0.rc.3 | Supported | Supported (built against 3.11.0) | Unsupported | Unsupported |
| 1.0.0 GA | Unvalidated and unsupported | Supported | Supported (built against 3.12.0) | Unsupported |

> [!Warning]
> The GA binary's displayed server-line list still includes 3.10.x.
> That display does not establish support: EDR 1.0.0 is validated and supported only with 3.11.x and 3.12.x sources.
> EDR rc.3 is the last release validated with 3.10.x sources.

The release validation covers 3.10.5 and 3.11.0 stores for rc.1 through rc.3.
GA validation covers 3.11.x and 3.12.x, including historic fill through compacted data written by 3.11.
An out-of-matrix
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

## Upgrade to EDR 1.0.0

### Replace a release candidate

For rc.1, rc.2, or rc.3 on a 3.11 source:

1. Stop the agent.
2. Replace the binary or container image with EDR 1.0.0.
3. Start it with the same configuration, state location, and source data location.
4. Check channel health and [outstanding work](/influxdb3/enterprise/edr/monitor/#outstanding-work-and-row-counts).

No configuration change is required for rc-to-GA replacement.
Keep the existing cursor and journals so the new agent resumes replication.
If the source still runs 3.10, first follow [Upgrade a 3.10 source and a 0.2.0 agent](#upgrade-a-310-source-and-a-020-agent).

### Upgrade a 3.10 source and a 0.2.0 agent

Keep every intermediate agent/server pairing within the support matrix.
See the [compatibility table](#supported-source-server-versions).

1. Upgrade EDR to `1.0.0-0.rc.3`, preserving its configuration, state, and source data locations.
   State migrates automatically from 0.2.0.
   Review the rc.1 change to UTC bandwidth schedules in the [release notes](/influxdb3/enterprise/edr/release-notes/#v100-0rc1).
2. Upgrade the source server from 3.10 to 3.11.
   The rc.3 agent supports both lines.
3. Replace rc.3 with EDR 1.0.0 using [Replace a release candidate](#replace-a-release-candidate).
4. If required, upgrade the source from 3.11 to 3.12.
   The GA agent supports both lines.

Do not upgrade the source directly from 3.10 to 3.12 while rc.3 is reading it.
Rc.3 does not support a 3.12 source.
Likewise, do not start the GA agent against a 3.10 source.

> [!Warning]
> Earlier builds can mislabel field values in tables wider than 100 fields.
> After upgrading from 0.2.0, rc.1, or rc.2, verify field-level values downstream or re-replicate affected tables.
> Row counts cannot detect this defect.
> See the [rc.3 release notes](/influxdb3/enterprise/edr/release-notes/#v100-0rc3).

## Storage format details

For details about the storage formats in the compatibility matrix, see
[Storage engine terms](/influxdb3/enterprise/edr/reference/architecture/#storage-engine-terms)
for what each one holds:

| Format | What EDR uses it for | Stability |
|---|---|---|
| `.pt` WAL files | live replication (block shipping) | unchanged across 3.10, 3.11, and 3.12 |
| `.ptsnap` snapshot manifests | snapshot boundary, historic planning | v3 across 3.10, 3.11, and 3.12 |
| [Compaction](/influxdb3/enterprise/reference/internals/durability/#upgraded-storage-engine-compaction) checkpoints (`.ptv2chk`)—the cv2 tier | historic fill and gap recovery read compacted data once EDR's WAL replicator can no longer see it | Versioned state stamps: v9 on 3.10; 3.11 and 3.12 can use v12 or v13. Checkpoint versions alone do not distinguish 3.11 from 3.12. |
| Run-set indexes (`.idx`) | Tracked by the compatibility matrix | 3.12 writes v3, which the 3.11 reader rejects; rc.3 does not support 3.12 sources. |
| Catalog | schema for encoding | versioned; compatibility tracked per release |

## Release compatibility summary

Each entry in [Release notes](/influxdb3/enterprise/edr/release-notes/) lists the EDR protocol version and supported InfluxDB 3 Enterprise server versions for that release.
It also identifies the Enterprise version and build revision used to build EDR.
