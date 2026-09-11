---
title: EDR configuration file reference
description: >
  Complete field reference for the EDR replication config YAML file—
  top-level fields, downstream and upstream shapes, scope, priorities, and
  bandwidth scheduling.
menu:
  influxdb3_edr:
    name: Configuration file
    parent: Reference
weight: 202
---

Configuration is a YAML file passed to the agent with `--config`. Tokens are
referenced **by name** and resolved at runtime from a token store directory
(`--token-store`)—secrets never live in the config file. For a
task-oriented walkthrough, see [Configure EDR](/influxdb3/edr/admin/configure/).

## Top-level fields

| Field | Type | Required | Description |
|----|---|-----|-------|
| `name` | String | Yes | Node identity name. Used in topology, logs, and UI. |
| `location` | Object | No | Geographic location (`label`, `lat`, `lng`). Shown on map UI. |
| `downstream` | Object | No* | Where this node sends data to. Shorthand for a one-entry `downstreams:` list. |
| `downstreams` | List | No* | Multiple downstream destinations (fan-out). See [Replicate to multiple destinations](/influxdb3/edr/admin/multi-destination-fan-out/). Declaring both forms at once is a config error. |
| `upstreams` | List | No* | Who sends data to this node. |

\* At least one of `downstream`/`downstreams` or `upstreams` must be
present. A node with both is a regional hub: it receives from edges and
forwards on.

## Downstream (source -> destination)

| Field | Type | Default | Description |
|----|---|-----|-------|
| `name` | String | — | Name of the destination node. |
| `address` | String | — | URL of the destination EDR agent (for example, `http://hub:9090`). |
| `auth_token` | String | — | Token store key for authenticating to the destination. |
| `mode` | `edr` \| `direct` | `edr` | `edr`: agent-to-agent. `direct`: write directly to an InfluxDB v3 write API. |
| `scope` | Object | Instance (all) | Which databases/tables to replicate. See [Scope](#scope). |
| `comms.interval_secs` | Integer | 10 | How often (seconds) to send status reports when idle. |
| `comms.degraded_after` | Integer | 3 | Missed reports before the destination considers this channel degraded. |
| `comms.unhealthy_after` | Integer | 6 | Missed reports before the destination considers this channel unhealthy. |
| `retry.initial_backoff_secs` | Integer | 1 | Initial retry backoff after send failure. |
| `retry.max_backoff_secs` | Integer | 30 | Maximum retry backoff. |
| `retry.multiplier` | Integer | 2 | Exponential backoff multiplier. |
| `retry.halt_patience_secs` | Integer | 180 | Patience window before persistent write errors / unclassified rejections trigger the halted state. See [The halted state](/influxdb3/edr/admin/monitor/#the-halted-state). |
| `share_topology` | Boolean | true | Include this node's upstream tree in reports to the destination. When false, this node appears as a leaf. |
| `idempotent_writes` | Boolean | false | User asserts no `(series_key, timestamp)` pair is ever written with differing field values. Unlocks `concurrent_sends > 1`, multi-ingest replication, priority reordering, and historic fill. See [Configure EDR](/influxdb3/edr/admin/configure/#performance-vs-correctness-idempotent_writes-and-concurrent_sends). |
| `historic_fill` | Object | **required** | Declares the historic start point (`mode: none` \| `full` \| `since`). No default—absent means the agent refuses to start. Modes `full`/`since` require `idempotent_writes: true`. See [Historic fill](/influxdb3/edr/admin/monitor/#historic-fill). |
| `priorities` | List | absent | Priority routing rules (first match wins). Requires `idempotent_writes: true`. See [Priorities](#priorities). |
| `on_state_loss` | `recover` \| `halt` | derived | What to do when a state journal AND its previous-good mirror are both corrupt. Default: `recover` when `idempotent_writes: true`, else `halt`. Explicit `recover` without the idempotency assertion is rejected. See [State & recovery](/influxdb3/edr/reference/state-and-recovery/). |
| `encoding` | `lp` \| `pt` | `lp` | Wire encoding. `pt` (PT+zstd) is agent-to-agent only, approximately 2.5x bandwidth saving. |
| `concurrent_sends` | Integer | 1 | Maximum concurrent send tasks. `1` = strict-order delivery (the default). `> 1` requires `idempotent_writes: true`; `0` is rejected. |
| `poll_interval_ms` | Integer | 1000 | WAL discovery poll interval. |
| `bandwidth_schedule` | List | absent | Time-of-day send rate control. See [Bandwidth scheduling](#bandwidth-scheduling). |
| `bandwidth_timezone` | String | `"utc"` | Timezone the whole `bandwidth_schedule` is interpreted in. IANA name (for example, `"Asia/Kolkata"`) or `"utc"`. |

## Upstreams (destination receiving sources)

Each entry in the `upstreams` list:

| Field | Type | Description |
|----|---|-------|
| `name` | String | Expected source node name (must match the source's `name`). |
| `auth_token` | String | Token store key for verifying the source's identity. Each upstream needs a unique auth token so the downstream can identify who connected. |
| `write_token` | String | Token store key for writing the source's data into local InfluxDB. |

## Scope

```yaml
# Replicate everything (default):
scope:
  type: instance

# Specific databases:
scope:
  type: databases
  names: [sensors, metrics]

# Specific tables:
scope:
  type: tables
  refs:
    - database: sensors
      table: temperature

# Everything EXCEPT named databases/tables (exclude wins; exact names only):
scope:
  type: instance
  exclude:
    databases: [internal_edr]
```

| `scope.type` | Meaning |
|---|---|
| `instance` | All databases on the source instance (the default when `scope` is absent). |
| `databases` | A named list of databases (all tables within each). |
| `tables` | Specific `{database, table}` pairs. |

Scope filtering happens at block evaluation: out-of-scope blocks are
dropped before queueing, so they consume no bandwidth. See
[Configure EDR](/influxdb3/edr/admin/configure/#scope) for the exclusion
semantics and validation rules.

## Priorities

Ordered, first-match-wins list. Requires `idempotent_writes: true`.

```yaml
priorities:
  - match: { type: tables, database: sensors, tables: [temperature, humidity] }
    recency: "1h"                    # data-time recency window: matches only
    priority: 1                      #   blocks whose max data time is within 1h of now
    share: 8                         # DRR weight for this tier (optional)
  - match: { type: database, name: sensors }
    recency: "24h"
    priority: 2
  - match: { type: all }
    priority: 3
    historic_fill: true              # historic fill traffic uses this tier
```

| Field | Type | Description |
|---|---|---|
| `match.type` | `all` \| `database` \| `tables` | What the rule matches. |
| `recency` | Duration | Optional data-time recency window; the rule matches only blocks whose max data time is within the window of now. |
| `priority` | Integer (1-255) | Lower is more urgent. Unique values become dispatch tiers. |
| `share` | Integer | Optional deficit round-robin (DRR) weight for this tier. |
| `historic_fill` | Boolean | One rule may claim historic fill traffic for its tier. Otherwise historic fill rides the lowest-priority tier. |

See [Priorities](/influxdb3/edr/reference/architecture/#priorities) for how
tiers are scheduled.

## Bandwidth scheduling

```yaml
downstream:
  # ... name, address, auth_token ...
  bandwidth_timezone: "Europe/London"   # optional; default "utc"
  bandwidth_schedule:
    - name: "Factory shutdown"
      dates: ["2026-08-10", "2026-08-11"]   # YYYY-MM-DD = this exact date only
      mode: silent
    - name: "Christmas"
      dates: ["12-25"]            # MM-DD = recurring every year
      mode: unlimited
    - name: "Maintenance window"
      hours: "02:00-03:00"
      mode: silent
      silent_reports: true
    - name: "Weekday business hours"
      hours: "08:00-18:00"
      days: [mon, tue, wed, thu, fri]   # optional; absent = every day
      mode: limited
      max_bytes_per_sec: 100000
    - name: "Weekday overnight"
      hours: "18:00-08:00"        # wraps midnight
      days: [mon, tue, wed, thu, fri]
      mode: unlimited
    - name: "Weekend"
      hours: "00:00-24:00"        # whole day, written as an explicit range
      days: [sat, sun]
      mode: unlimited
```

| Field | Description |
|----|-------|
| `name` | Optional label, shown in the UI and logs. |
| `hours` | `"HH:MM-HH:MM"`, 24-hour, in the schedule's timezone (see `bandwidth_timezone`). Wraps midnight (`"22:00-06:00"`). `"24:00"` is accepted as an end-of-day sentinel only, so a whole-day window can be written as `"00:00-24:00"` instead of the off-by-one `"00:00-23:59"`—as a *start* time it's a config error. Mutually exclusive with `dates`. |
| `days` | Optional list of `mon`/`tue`/`wed`/`thu`/`fri`/`sat`/`sun` restricting which weekdays `hours` applies to. Absent = every day. A wrapping window (for example, `"22:00-06:00", days: [fri]`) is anchored to its **start day**—the post-midnight tail on Saturday still counts as Friday's window. Combining `days` with `dates` is a config error. |
| `dates` | Optional list of calendar-date overrides, matching the **whole day**: `"YYYY-MM-DD"` (one-time—this exact date only) or `"MM-DD"` (no year—recurs every year, for example `"12-25"`). An entry has either `hours` (+ optional `days`) or `dates`, never both—combining them, or setting neither, is a config error. |
| `mode` | `unlimited` (full speed), `limited` (throttled to `max_bytes_per_sec`), or `silent` (no data sends). |
| `max_bytes_per_sec` | Required for `limited`. |
| `silent_reports` | For `silent` mode: keep sending status reports (default true). When false, no traffic at all—the downstream marks the channel unhealthy for the duration. |

Entries are evaluated in order; the first matching entry wins. When
`bandwidth_schedule` is absent, or nothing matches at a given moment, the
pipeline runs unlimited. See
[Configure EDR](/influxdb3/edr/admin/configure/#bandwidth-scheduling) for
validation behavior and the UTC-by-default change at the 1.0.0 release
candidate.

## Direct mode

```yaml
downstream:
  name: "cloud-influx"
  address: "https://cloud.influxdata.com"
  auth_token: "cloud-api-token"
  mode: direct
```

See [Configure EDR](/influxdb3/edr/admin/configure/#direct-mode) for
behavior differences from agent-to-agent mode.

## Configuration reload

The config file is polled for changes. Reloadable without restart: scope,
comms expectations, retry parameters. Requiring a restart: node name,
upstream list, destination address, destination mode, `idempotent_writes`,
priority rules, token store path, data directory, listen address. The agent
logs the reason when a change is rejected for hot-reload.

## Multi-ingest node support

When InfluxDB 3 Enterprise runs as a cluster with multiple ingest nodes
sharing an object store, each node produces WAL files under its own path
prefix. Set `idempotent_writes: true` and the agent discovers all node
prefixes automatically, tracking an independent WAL cursor per node.

The user guarantee behind `idempotent_writes`: no `(series_key, timestamp)`
pair is ever written with differing field values across any ingest node.
Duplicate writes with identical values are fine. If your load balancer
hashes by series key, the guarantee holds automatically.

With `idempotent_writes: false` (default), the agent **refuses to start**
if multiple ingest nodes are detected—this prevents silent data
corruption.

Cursors are stored per node in the state file; an upgrade from a
single-node deployment migrates the existing cursor automatically.
