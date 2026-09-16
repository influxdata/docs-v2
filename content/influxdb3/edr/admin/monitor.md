---
title: Monitor EDR
description: >
  Watch EDR replication health, lag, and progress using the embedded UI,
  Prometheus metrics, the JSON metrics API, SSE updates, and the edr-inspect
  triage CLI.
menu:
  influxdb3_edr:
    name: Monitor
    parent: Manage
weight: 107
---

## Embedded UI

Every EDR agent serves a web UI at `/ui` on its **observability listener**
(`--observability-listen`, loopback `127.0.0.1:9091` by default): topology
tree with health badges, per-channel metrics (bytes, lag, retry state),
historic fill progress, and an activity log. Server-computed status
only—all thresholds come from config.

## Endpoints

The observability endpoints below are served on `--observability-listen`
(loopback by default—expose with `--observability-listen 0.0.0.0:<port>`).
`/health` and the replication protocol are on the network `--listen`.

| Endpoint | Purpose |
|-----|-----|
| `GET /metrics` | Prometheus exposition format (for example, `edr_downstream_bytes_received_total{upstream=...}`, `edr_downstream_write_failures_total{...}`). |
| `GET /edr/v1/metrics_json` | Structured JSON metrics. Key fields under `self_upstream_metrics`: `pending_bytes`, `in_flight_sends`, `priority_queue_depth`, `batches_sent`, `bytes_sent`, `consecutive_send_failures`, `gaps_pending`, `historic_fill_active`, `gapfill_files_done`/`_total`, `tier_depths`, `cursor_wal_id`. |
| `GET /edr/v1/status` | Channel/connection status. |
| `GET /edr/v1/node_info` | Node identity and health summary. |
| `GET /edr/v1/events` | Server-Sent Events stream of real-time state changes. |
| `GET /health` | Liveness. |

## Historic fill

Historic fill replicates data that existed on the source *before* EDR was
deployed (or before this destination was added).

`historic_fill` is required—there is no default. If it's absent, the agent
**refuses to start** and prints the choices below. This is deliberate:
attaching to an existing source without declaring intent is the one
decision EDR will not make for you.

```yaml
downstream:
  # ... name, address, auth_token ...
  historic_fill:
    mode: none            # required -- choose: none | full | since
    # mode: full
    # mode: since
    # since: "7d"         # only with mode: since -- whole days (Nd) or ISO date (no sub-day units)
```

| Mode | Behavior |
|---|-----|
| `none` | **Live only.** Start at the most recent WAL (the leading edge) and replicate new data as it lands; no pre-existing data is backfilled. Data that evicts before EDR reaches it is *not* recovered. |
| `full` | Backfill **all** pre-existing data (from snapshots / cv2), then live. |
| `since` | Backfill pre-existing data whose **data timestamp** is after the `since` threshold, then live. Threshold is a whole-day duration (`7d`, `30d`—floored to the start of that UTC day) or an ISO date (`2026-06-01`). Sub-day units (`30m`, `6h`) are **rejected**—cv2 is partitioned by data date, so day is the only honest resolution. An unparseable value fails at startup. |

**Start point.** On a fresh start, *every* mode (including `none`) seeds the
live cursor to the **snapshot boundary**—the frontier WAL ID near the
leading edge—so live replication begins from the most recent WAL, never
from WAL 1. The difference between the modes is only what (if anything)
gets backfilled *below* that boundary. `none` does no backfill; `full`/
`since` hand the below-boundary data to historic fill.

The historic/live boundary is in WAL-ID (ingest) space and is computed once
at startup; the `since` threshold filters by *data timestamp* (event time).

### How historic fill works

On first startup (no prior cursor), the agent computes a snapshot
boundary—the frontier WAL ID. The live WAL replicator handles everything
after the frontier; historic fill handles everything before it:

1. **Snapshot manifests (`.ptsnap`)** are read to build a work list of gen0
   files, each carrying its WAL range and time range.
2. **Gen0 files** on the work list are read and replicated, one file at a
   time, at lower priority than live data (unless a priority rule claims
   historic fill explicitly).
3. **cv2 files (L1+)** are the primary medium for genuinely old data—data
   whose gen0 files and snapshot manifests have already been compacted
   away. cv2 candidates are enumerated by time window and processed as
   first-class work list entries.

Progress is persisted in a manifest file, so historic fill survives agent
restarts and resumes where it left off. When the work list is exhausted the
fill is marked complete and never runs again (the manifest records
completion).

### What to expect in the logs

Historic fill is deliberately loud. These messages are normal:

- `historic fill: starting — N snapshots, M files`—work list built.
- `historic fill: MANIFEST GAP — snapshot manifests for WAL X-Y were
  deleted by compactor. Will recover from WAL files or cv2 files.`—
  **expected** whenever the compactor has cleaned up older snapshot
  manifests. The agent recovers the gap from surviving WAL files where
  possible, and from cv2 files for the evicted head.
- `historic fill: MANIFEST GAP only partially covered by WAL files — WAL
  X-Y were evicted. Enumerating cv2 files for the evicted head; cv2 is the
  primary medium for this data.`—the mixed three-tier situation: a suffix
  of the gap comes from WAL files, the evicted head from cv2.
- `historic fill: added N cv2 work list entries ...`—cv2 recovery in
  progress.
- Warnings about over-replication when sending cv2 files: cv2 files are
  compacted, so they contain data beyond the exact recovery window.
  Block-level time filters cut this down, but some over-replication is
  inherent. **These loud warnings are EXPECTED when recovering compacted
  data**—the destination's idempotent writes absorb the duplicates, and
  correctness is unaffected. The warnings exist so you can see the
  bandwidth cost, not because something is wrong.
- `historic fill: MANIFEST GAP — ... no cv2 files found covering the gap —
  POTENTIAL DATA LOSS`—this one is **not** normal. It means data was
  deleted from every tier (WAL, gen0, cv2) before EDR could read it.
  Investigate retention settings.
- `historic fill: completed` / `historic fill: already completed —
  skipping`—done; restart-safe.

During a fill, the metrics API reports `historic_fill_active`,
`gapfill_files_done`, and `gapfill_files_total` so you can track progress.

## Gap fill

Gap fill handles the live-replication analogue of the historic problem: a
WAL file the replicator expected was deleted (snapshotted and evicted)
before it could be sent—typically after a long outage with short WAL
retention. The agent detects the missing WAL ID range, records it in a gap
ledger, and recovers the data through the same tiered matching as historic
fill: snapshot manifests, gen0 files, cv2 files.

Operationally:

- Gaps appear in metrics as `gaps_pending` and in the gap ledger file next
  to the state file. After recovery they are marked resolved.
- **A recovering agent is visibly recovering.** Gaps a round is actively
  working move from `gaps_pending` to `gaps_in_progress` (pending counts
  only untouched gaps), and the round's phases publish progress:
  `gapfill_discovery_candidates` / `gapfill_discovery_scanned` while it
  searches the store for covering files, then `gapfill_files_done` /
  `gapfill_files_total` while it replicates them. If those gauges are
  moving, recovery is working—even when `gaps_resolved_total` hasn't
  ticked yet (gaps settle when their round completes).
- `gapfill_files_vanished_total` counts covering files the server's
  compactor removed mid-recovery (the agent re-discovers their
  replacements automatically). A high rate means recovery is racing
  compaction—expect rounds to take longer.
- Recovery from gen0 is precise. Recovery from cv2 over-replicates (see
  above)—expected, absorbed by idempotent writes.
- If you see gaps regularly, increase `--wal-snapshots-to-keep` on the
  source InfluxDB. See
  [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/); recovery
  from compacted files is a safety net, not the intended steady state.

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

## Grafana dashboard (replication health)

A ready-made Grafana dashboard turns the `/metrics` endpoint above into a
fleet-level headline, a per-channel status table, and time-series detail.
The pipeline is Telegraf (scrapes `/metrics`) to a local InfluxDB database
to Grafana. The config and dashboard files ship in two places—the
`observability/` folder at the top of the EDR documentation bundle, and (the
same files) `signals-demo/observability/` inside the demo bundle, where the
demo's optional observability overlay mounts them. They're generic: nothing
in them is demo-specific, so use either copy for a production deployment.

| File | Purpose |
|---|---|
| `telegraf/telegraf.conf` | Scrapes this node's `/metrics` and writes it to a local database |
| `grafana/provisioning/datasources/internal_edr.yml` | Points Grafana at that database |
| `grafana/provisioning/dashboards/dashboards.yml` | Loads the dashboard below automatically on startup |
| `grafana/dashboards/edr-overview.json` | The dashboard itself |

**One Grafana per node, not centralized.** Each node's dashboard reads only
that node's own metrics, from a database dedicated to them (`internal_edr`
by default) on that node's own InfluxDB—it is deliberately not part of the
data being replicated between nodes, so there is nothing to aggregate
centrally.

### 1. Exclude the metrics database from replication

This only applies to a node that has its own `downstream:`—a source or a
relay, that is, anything that forwards data onward. A pure destination node
has nothing to exclude and can skip straight to step 2.

`internal_edr` is local operational data, not something to ship downstream.
The default scope (`type: instance`, replicate everything) would otherwise
pick it up. Add a scope exclusion in the `scope` block under `downstream:`
in this node's EDR agent config file:

```yaml
downstream:
  # ... name, address, auth_token ...
  scope:
    type: instance          # everything else still replicates,
    exclude:                # including databases created later
      databases: [internal_edr]
```

If you're already scoping to specific databases (`type: databases`), just
leave `internal_edr` off the list—an allowlist that doesn't name it already
keeps it local.

### 2. Create the metrics database

On this node's InfluxDB, create a database named `internal_edr` (or your own
name—keep `telegraf.conf`'s `bucket` and the datasource's `dbName` in sync
if you rename it) to hold Telegraf's writes.

### 3. Configure Telegraf

Point Telegraf at the shipped `observability/telegraf/telegraf.conf`
unmodified—don't write your own—and set the environment variables it
expects before starting it:

| Variable | Example | Purpose |
|---|---|---|
| `EDR_METRICS_URL` | `http://localhost:9091/metrics` | This node's EDR agent, observability listener |
| `INFLUX_WRITE_URL` | `http://localhost:8181` | This node's InfluxDB |
| `INFLUX_ADMIN_TOKEN` | — | This InfluxDB instance's admin token |
| `EDR_SCRAPE_INTERVAL` | `10s` (default) | Optional. Scrape **and** flush cadence—see below. |

```bash
EDR_METRICS_URL=http://localhost:9091/metrics \
INFLUX_WRITE_URL=http://localhost:8181 \
INFLUX_ADMIN_TOKEN=<admin-token> \
telegraf --config observability/telegraf/telegraf.conf
```

`EDR_SCRAPE_INTERVAL` is the only knob that governs dashboard freshness: the
status panels read the latest sample per channel with no averaging window,
so the dashboard reflects a channel's real health within one scrape
interval of the agent deciding it. The default `10s` suits a production
fleet; drop it to `1s`-`2s` for a near-live view (`/metrics` is cheap to
generate). It does **not** change how quickly the agent itself declares a
channel degraded or down—that is the `comms` anti-flap window on the
sending node (`comms.interval_secs` / `degraded_after` / `unhealthy_after`
in [Configuration file reference](/influxdb3/edr/reference/config-file/)).

> [!Important]
> If you adapt the file, keep `name_override = "edr"` in the
> `[[inputs.prometheus]]` block—every dashboard query is `FROM "edr"`;
> without it Telegraf writes to its default measurement name (`prometheus`)
> and every panel silently shows no data.

### 4. Configure Grafana

Mount `observability/grafana/provisioning/` and
`observability/grafana/dashboards/` at the paths Grafana expects
(`/etc/grafana/provisioning/datasources/`,
`/etc/grafana/provisioning/dashboards/`, and the folder `dashboards.yml`'s
`path` points at), and set two environment variables for the Grafana
process before starting it. They're read from `${INFLUX_QUERY_URL}` /
`${INFLUX_ADMIN_TOKEN}` placeholders inside
`grafana/provisioning/datasources/internal_edr.yml`, which Grafana expands
from its own environment at startup—the same admin token as step 3, not a
separate one:

| Variable | Example | Purpose |
|---|---|---|
| `INFLUX_QUERY_URL` | `http://localhost:8181` | This node's InfluxDB |
| `INFLUX_ADMIN_TOKEN` | — | This InfluxDB instance's admin token |

```bash
INFLUX_QUERY_URL=http://localhost:8181 \
INFLUX_ADMIN_TOKEN=<admin-token> \
grafana-server --homepath /usr/share/grafana
```

The dashboard itself loads automatically on startup—`dashboards.yml`
points Grafana at the mounted `grafana/dashboards/edr-overview.json`, no
manual import needed.

A worked example ships with the
[signals demo](/influxdb3/edr/demo/)—its optional
`compose.observability.yaml` overlay gives every one of the four nodes this
same Telegraf + Grafana pipeline (`demo/signals-demo/` in the source
repository).

### 5. Verify

Open Grafana and confirm the fleet headline row shows a healthy count. If
every panel is empty:

- Check Telegraf's logs for scrape or write errors, and confirm
  `name_override = "edr"` is set.
- Confirm the datasource's token has read access to `internal_edr`.
- Confirm the EDR agent's observability listener is reachable from wherever
  Telegraf runs (loopback by default—see [Endpoints](#endpoints) above).

### What you'll see

| Tier | Shows |
|---|---|
| Fleet headline | Healthy / unhealthy counts, upstream and downstream |
| Channel status table | Exactly one row per channel—network/application health, status |
| Detail — upstream (selectable per upstream) | Bytes received/sec, write failures & columns dropped |
| Detail — downstream (totals across all destinations) | Bytes sent/sec, pending backlog, WAL backlog, gaps, halted state per destination |

Terminology matches the rest of this guide: **upstream** channels are nodes
sending data to this node; **downstream** is where this node sends data to.

The headline and status-table panels show **current** state—each reads the
latest sample per channel with no averaging window—so they track the
agent's own health within one `EDR_SCRAPE_INTERVAL`, never show a channel in
two states at once, and clear the moment a recovery is scraped. The
time-series detail panels are historical, as usual.

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
| `edr-inspect state <state-location>` | the state journals only (offline—no running agent) | live replication (WAL cursor), live gap fill (gap ledger), historic replication (manifest progress) |
| `edr-inspect metrics [addr]` | the live `/metrics` (observability listener) | a scrolling table watch; `--once` for one detailed block |
| `edr-inspect topology [addr]` | `/edr/v1/topology` | a one-shot upstream/downstream ASCII diagram with per-edge health |

`state` works even against a **stopped or wedged** agent (it reads the
journals directly); it also accepts a cloud `state-location`
(`s3://`/`gs://`/`az://`, credentials from the environment). `metrics`/
`topology` default to the loopback observability address
(`$INFLUXDB3_EDR_OBSERVABILITY_LISTEN`). In Docker, run these via
`docker exec` with no arguments—see
[Run EDR in Docker](/influxdb3/edr/install/docker/#triage-with-edr-inspect-via-docker-exec).
