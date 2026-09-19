---
title: EDR replication protocol reference
description: >
  The EDR agent-to-agent replication protocol—endpoints, protocol version
  negotiation, capabilities, and the observability API.
menu:
  influxdb3_edr:
    name: API
    parent: Reference
weight: 204
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/edr-spec.md, docs/external/compatibility.md -->

> [!Note]
> `v1` in `/edr/v1/*` is the EDR replication protocol's own version. It has
> no relationship to InfluxDB v1. EDR sources from InfluxDB 3 Enterprise and
> replicates to InfluxDB 3 Enterprise, InfluxDB 3 Cloud, or AWS Timestream
> for InfluxDB 3.

Agent-to-agent communication is HTTP-based. The downstream facet serves the
endpoints below. The upstream agent connects (`/connect`), then sends data
batches (`/data`) and periodic reports (`/report`, default every 10
seconds). The report carries the upstream's health and, when
`share_topology` is enabled, the tree of upstreams behind it—this is how a
central node assembles a full network picture without direct connectivity
to every edge.

The HTTP response acknowledges each data batch synchronously. The
upstream's replication cursor advances only on confirmed delivery.

## Replication protocol endpoints

These endpoints carry the EDR agent-to-agent replication protocol
(`/edr/v1/*`), not an InfluxDB 3 API.

| Endpoint | Method | Purpose |
|---|---|---|
| `/edr/v1/connect` | POST | Handshake: upstream declares identity, scope, comms expectations, topology. Sent only between agents negotiating protocol v2 or below; not sent between v3 peers. |
| `/edr/v1/data` | POST | Data batches in Line Protocol (LP) or zstd-compressed [PT](/influxdb3/enterprise/reference/internals/storage-engine/#new-file-format) format. |
| `/edr/v1/report` | POST | Periodic status report: health, progress, upstream topology. Default interval 10 seconds. |
| `/health` | GET | Liveness. |

## Observability API endpoints

These endpoints expose an EDR agent's own replication metrics and status,
not InfluxDB 3 data.

| Endpoint | Method | Purpose |
|---|---|---|
| `/metrics` | GET | Prometheus-format metrics for both facets, including send/receive byte and row counters, per-tier queue depths (`edr_upstream_tier_queue_depth{tier=...}`), cursor positions, retry counts, gap and historic fill progress, and over-replication counters. |
| `/edr/v1/metrics_json` | GET | The same data as structured JSON, including the `tier_depths` array, for programmatic consumption and the UI. |
| `/edr/v1/status` | GET | This node's replication state: facets, channels, health, cursors, backlog. |
| `/edr/v1/topology` | GET | The replication network as known to this node (its upstream tree, assembled from reports, plus its downstream link). |
| `/edr/v1/logs` | GET | Recent structured log entries. |
| `/edr/v1/node_info` | GET | Node identity, role, location, outbound health, and outbound metric snapshots. |
| `/edr/v1/events` | GET | Server-Sent Events (SSE) stream that fires when state changes, used by the UI for live updates without polling. |
| `/ui` | GET | Embedded web UI. |

<!-- VERIFIED against a live EDR 1.0.0-rc.1 and InfluxDB 3 Enterprise 3.11.4
cluster: node_info returned these numeric halt fields, and edr-inspect rendered
the mapped labels. -->

### Halt fields

`GET /edr/v1/node_info` returns the outbound metric snapshot under
`upstream_facet` when the agent has one destination.
For multiple destinations, read each snapshot under
`upstream_facet_by_destination[]`.

Use these values to interpret the halt fields in either snapshot:

| Field | Value | Meaning |
|---|---|---|
| `replication_halted` | `0` | Replication isn't halted. |
| `replication_halted` | Positive integer | The value counts halted batches. |
| `last_write_result` | `0` | The agent hasn't attempted a write. |
| `last_write_result` | `1` | The last write succeeded. |
| `last_write_result` | `2` | Authentication failed. |
| `last_write_result` | `3` | A schema conflict blocked the write. |

`edr-inspect metrics` translates `last_write_result` into
`last-write=unknown`, `last-write=success`, `last-write=auth_failure`, or
`last-write=schema_conflict`.
When `replication_halted` is greater than `0`, the command also prints
the `REPLICATION HALTED: N batch(es)` message.

The replication protocol endpoints and `/health` are served on the network
listener (`--listen`, default `0.0.0.0:9090`). The observability endpoints
are served on the observability listener (`--observability-listen`,
loopback `127.0.0.1:9091` by default). See
[CLI reference](/influxdb3/edr/reference/cli/).

Logging is structured JSON (tracing) covering replication progress,
connection state changes, errors and retries, configuration changes, gap
advisories, and historic fill recovery decisions (including every loud
over-replication warning). Significant state changes and exceptions are
additionally emitted through the audit service provider interface (SPI)
(stdout implementation initially).

## Protocol version negotiation

Directly connected agents negotiate a **protocol version** and a
**capability set**, per hop—never propagated along a relay chain (a bad
hop reports at that hop; the rest of the chain is unaffected).

- **Protocol v1** is the name for the wire behavior of agents released before
  versioning existed (0.1.x and 0.2.x).
  Those agents send no version fields.
  EDR interprets missing version fields as protocol v1.
  The protocol v1 behavior hasn't changed.
- **Protocol v2** (interim development builds; never in a released
  version) added explicit protocol negotiation.
  Protocol v2 agents negotiate at `/connect`.
  The `/connect` request gates `/data`.
  The `/data` endpoint returns HTTP 428 until the agents connect.
- **Protocol v3** (current) uses the **stateless data path**.
  Every `/report` includes the upstream agent's full declaration: identity,
  location, communication settings, agent version, and protocol declaration.
  The downstream agent returns its declaration in the `ReportAccept` response.
  Both agents negotiate the protocol on every report.
  A response without a downstream declaration identifies a protocol v2 or
  earlier agent.
  Every `/data` request includes a compact declaration in the `X-EDR-Name`,
  `X-EDR-Protocol: <declared>,<min>`, and `X-EDR-Caps` headers.
  Protocol v3 peers never send `/connect`.
  The `/data` endpoint requires no prior contact.
  Any receiver instance can serve any request.
  This stateless behavior supports receiver fault tolerance and load balancing.
- Both agents calculate the same agreement.
  The effective version is the lower of the two declared versions.
  An agent refuses the connection if the effective version is lower than either
  agent's minimum.
  An effective version below protocol v3 selects the v2 connect-gated flow.
  Mixed-version fleets require no additional configuration.

| Upstream \ Downstream | 0.1.x / 0.2.x (v1) | interim dev builds (v2) | 1.0.0-0.rc.1+ (v3) |
|---|---|---|---|
| **0.1.x / 0.2.x** | v1 (implicit) | v1—accepted | v1—accepted |
| **interim dev builds** | v1—accepted | v2, connect-gated | v2, connect-gated |
| **1.0.0-0.rc.1+** | v1—accepted | v2, connect-gated | **v3, stateless** |

With the current minimums, **no released pairing can be refused**. The
first possible refusal requires a future release that deliberately raises
its minimum—a compatibility break that will be called out in
[release notes](/influxdb3/edr/release-notes/).

### Refusal

Refusal is explicit and terminal. The refusing side answers **HTTP 426**
(on `/connect`, `/report`, or `/data`) with a diagnosis naming both
versions and both minimums; the upstream latches a **protocol halt**:
dispatch stops (nothing pops from any tier), health reads `Halted`, the
reason appears in the status API, the UI, and the logs, and a WARN
repeats once a minute while halted. Negotiation re-runs on **every
report** (default 10s), so a peer upgrade clears the halt within one
report interval—there's no separate probe task. See
[Troubleshoot EDR](/influxdb3/edr/troubleshoot/common-issues/#protocol-incompatible-agents-of-different-versions).

### Capabilities

Capabilities gate optional features (the version gates wire-breaking
changes). Initial registry: `pt-wire-1`—the PT wire format
(`encoding: pt`). A downstream that negotiates successfully but lacks a
capability the local config requires produces the same protocol halt, with
a message naming the config key.

## Security and tokens

- **TLS** is required for all upstream-downstream communication in
  production deployments.
- **Token-by-name model**: the YAML config references tokens by name;
  values are resolved at runtime from the token store (file-based
  directory, one token per named entry, validated at startup). Config
  files are therefore safe to version and share.
- **Authentication**: each upstream presents its auth token when
  connecting; the downstream maps the token to the expected upstream
  identity (`upstreams[].auth_token`).
- **Authorization by the destination**: the downstream writes each
  upstream's data using that upstream's `write_token` against the local
  InfluxDB 3 instance. The token's permissions on the destination determine
  what the upstream can effectively write—EDR implements no authorization
  layer of its own. Restricting or revoking an upstream is done by scoping
  or revoking its tokens.

See [Manage tokens](/influxdb3/edr/manage-tokens/) for token store
operations.
