---
title: Monitor EDR
description: >
  Watch EDR replication health using the embedded UI, Prometheus metrics,
  the JSON metrics API, SSE updates, and the edr-inspect triage CLI.
menu:
  influxdb3_edr:
    name: Monitor
weight: 6
---

1. [Embedded UI](#embedded-ui)
2. [Endpoints](#endpoints)
3. [The halted state](#the-halted-state)
4. [Health model](#health-model)
5. [Triage CLI (edr-inspect)](#triage-cli-edr-inspect)

For backfilling pre-existing or gapped data, see
[Historic fill and gap fill](/influxdb3/edr/monitor/historic-and-gap-fill/).
For a Grafana dashboard built on the metrics below, see
[Grafana dashboard](/influxdb3/edr/monitor/grafana-dashboard/).

## Embedded UI

Every EDR agent serves a web UI at `/ui` on its **observability listener**
(`--observability-listen`, loopback `127.0.0.1:9091` by default): topology
tree with health badges, per-channel metrics (bytes, lag, retry state),
historic fill progress, and an activity log. Status is server-computed
only—all thresholds come from config.

## Endpoints

The observability endpoints below are served on `--observability-listen`
(loopback by default—expose with `--observability-listen 0.0.0.0:<PORT>`).
`/health` and the replication protocol are on the network `--listen`.

| Endpoint | Purpose |
|-----|-----|
| `GET /metrics` | Prometheus exposition format (for example, `edr_downstream_bytes_received_total{upstream=...}`, `edr_downstream_write_failures_total{...}`). |
| `GET /edr/v1/metrics_json` | Structured JSON metrics. Key fields under `self_upstream_metrics`: `pending_bytes`, `in_flight_sends`, `priority_queue_depth`, `batches_sent`, `bytes_sent`, `consecutive_send_failures`, `gaps_pending`, `historic_fill_active`, `gapfill_files_done`/`_total`, `tier_depths`, `cursor_wal_id`. |
| `GET /edr/v1/status` | Channel/connection status. |
| `GET /edr/v1/node_info` | Node identity and health summary. |
| `GET /edr/v1/events` | Server-Sent Events stream of real-time state changes. |
| `GET /health` | Liveness. |

## The halted state

EDR never voluntarily skips deliverable data. When the downstream
persistently **refuses** data that exists and could be delivered, the agent
halts replication rather than replicate around the problem—a downstream
that is stale-but-consistent as of the halt point beats one that looks live
but silently misrepresents some tables.

Halting triggers:

- **Schema conflict**—immediately. Fix the downstream schema.
- **Authentication failure**—immediately. Fix the token/config.
- **Malformed batch** (the receiver cannot parse what this agent sent)—
  immediately. Usually a version mismatch: upgrade the downstream agent.
- **Persistent write errors / unclassified rejections**—after the
  patience window (`retry.halt_patience_secs`, default 180). Within the
  window they are treated as transient and retried quietly.

What Halted means:

- Dispatch stops on **every** tier—no partial replication past the halt
  point. Upstream data keeps accumulating safely on the object store; the
  cursor does not move; nothing is lost.
- Underneath, the refused batch keeps retrying (every 60s for
  schema/malformed)—it is the probe. **The moment the downstream accepts
  it, replication auto-resumes in order.** No restart, no acknowledgement
  step.
- You will see it: `replication_halted` > 0 and `halted_since_ns` in
  metrics (both ends—the flag travels in the report), an ERROR log line on
  entry naming the database and reason, a WARN heartbeat on every probe
  with the halt duration, and an audit event.

Network outages and downstream restarts do **not** halt—they retry with
backoff and show as degraded health; they self-correct.

Escape hatches (deliberately the only ones): fix the downstream
(auto-resume), or exclude the offending table from the replication scope
and restart the agent. There is intentionally no "skip after N hours"
option.

## Health model

Two layers, combined for display:

- **Network health** (silence duration vs the comms config): Healthy /
  Degraded (missed `degraded_after` intervals) / Unreachable (missed
  `unhealthy_after`) / Unknown (never connected).
- **Application health** (last write result): Active / Unauthorised /
  SchemaConflict / Stalled (network unreachable) / Unknown.

Health status is the worst of (retry count vs config thresholds, silence
duration vs config thresholds). Heartbeats/reports do not count as
successful data sends—`last_successful_send_ts` only advances on real
data. Schema and auth issues are local to the two directly connected nodes;
they are not propagated up the chain.

## Triage CLI (`edr-inspect`)

`edr-inspect` is a **read-only** triage tool shipped alongside the agent.
Three independent subcommands, each reading one source:

| Command | Reads | Output |
|---|---|---|
| `edr-inspect state <STATE_LOCATION>` | the state journals only (offline—no running agent) | live replication (WAL cursor), live gap fill (gap ledger), historic replication (manifest progress) |
| `edr-inspect metrics [addr]` | the live `/metrics` (observability listener) | a scrolling table watch; `--once` for one detailed block |
| `edr-inspect topology [addr]` | `/edr/v1/topology` | a one-shot upstream/downstream ASCII diagram with per-edge health |

`state` works even against a **stopped or wedged** agent (it reads the
journals directly); it also accepts a cloud `state-location`
(`s3://`/`gs://`/`az://`, credentials from the environment). `metrics`/
`topology` default to the loopback observability address
(`$INFLUXDB3_EDR_OBSERVABILITY_LISTEN`). In Docker, run these via
`docker exec` with no arguments—see
[Run EDR in Docker](/influxdb3/edr/install/docker/#triage-with-edr-inspect-via-docker-exec).
