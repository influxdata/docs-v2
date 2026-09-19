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

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/configuration.md, docs/external/edr-spec.md, docs/external/operations.md -->

Configuration is a YAML file passed to the agent with `--config`. Tokens are
referenced **by name** and resolved at runtime from a token store directory
(`--token-store`)—secrets never live in the config file. For a
task-oriented walkthrough, see [Get started with EDR](/influxdb3/edr/get-started/).

## Top-level fields

| Field | Type | Required |
|---|---|---|
| `name` | String | Yes |
| `location` | Object | No |
| `downstream` | Object | No* |
| `downstreams` | List | No* |
| `upstreams` | List | No* |

- **`name`**—node identity name. Used in topology, logs, and UI.
- **`location`**—geographic location (`label`, `lat`, `lng`). Shown on
  map UI.
- **`downstream`**—where this node sends data to. Shorthand for a
  one-entry `downstreams:` list.
- **`downstreams`**—multiple downstream destinations (fan-out). See
  [Replicate to multiple destinations](/influxdb3/edr/replicate/to-multiple-destinations/).
  Declaring both forms at once is a config error.
- **`upstreams`**—who sends data to this node.

\* At least one of `downstream`, `downstreams`, or `upstreams` must
be present. A node with both is a regional hub: it receives from
edges and forwards on.

## Downstream (source -> destination)

| Field | Type | Default |
|---|---|---|
| `name` | String | — |
| `address` | String | — |
| `auth_token` | String | — |
| `mode` | `edr` \| `direct` | `edr` |
| `scope` | Object | Instance (all) |
| `comms.interval_secs` | Integer | 10 |
| `comms.degraded_after` | Integer | 3 |
| `comms.unhealthy_after` | Integer | 6 |
| `retry.initial_backoff_secs` | Integer | 1 |
| `retry.max_backoff_secs` | Integer | 30 |
| `retry.multiplier` | Integer | 2 |
| `retry.halt_patience_secs` | Integer | 180 |
| `share_topology` | Boolean | true |
| `idempotent_writes` | Boolean | false |
| `historic_fill` | Object | **required** |
| `priorities` | List | absent |
| `on_state_loss` | `recover` \| `halt` | derived |
| `encoding` | `lp` \| `pt` | `lp` |
| `concurrent_sends` | Integer | 1 |
| `poll_interval_ms` | Integer | 1000 |
| `bandwidth_schedule` | List | absent |
| `bandwidth_timezone` | String | `"utc"` |

- **`name`**—name of the destination node.
- **`address`**—URL of the destination EDR agent (for example,
  `http://hub:9090`).
- **`auth_token`**—token store key for authenticating to the
  destination.
- **`mode`**—`edr`: agent-to-agent. `direct`: write directly to an
  InfluxDB v3 write API.
- **`scope`**—which databases and tables to replicate. See
  [Scope](#scope).
- **`comms.interval_secs`**—how often (seconds) to send status reports
  when idle.
- **`comms.degraded_after`**—missed reports before the destination
  considers this channel degraded.
- **`comms.unhealthy_after`**—missed reports before the destination
  considers this channel unhealthy.
- **`retry.initial_backoff_secs`**—initial retry backoff after send
  failure.
- **`retry.max_backoff_secs`**—maximum retry backoff.
- **`retry.multiplier`**—exponential backoff multiplier.
- **`retry.halt_patience_secs`**—patience window before persistent
  write errors or unclassified rejections trigger the halted state.
  See [The halted state](/influxdb3/edr/monitor/#the-halted-state).
- **`share_topology`**—include this node's upstream tree in reports to
  the destination. When false, this node appears as a leaf.
- **`idempotent_writes`**—user asserts no `(series_key, timestamp)`
  pair is ever written with differing field values. Unlocks
  `concurrent_sends > 1`, multi-ingest replication, priority
  reordering, and historic fill. See
  [Performance vs. correctness](#performance-vs-correctness) below.
- **`historic_fill`**—declares the historic start point (`mode: none`
  \| `full` \| `since`). No default—absent means the agent refuses to
  start. Modes `full` and `since` require `idempotent_writes: true`.
  See [Historic fill](/influxdb3/edr/monitor/historic-and-gap-fill/#historic-fill).
- **`priorities`**—priority routing rules (first match wins). Requires
  `idempotent_writes: true`. See [Priorities](#priorities).
- **`on_state_loss`**—what to do when a state journal and its
  previous-good mirror are both corrupt. Default: `recover` when
  `idempotent_writes: true`, else `halt`. Explicit `recover` without
  the idempotency assertion is rejected. See
  [State and recovery](/influxdb3/edr/reference/state-and-recovery/).
- **`encoding`**—wire encoding. `pt` (zstd-compressed PT) is
  agent-to-agent only, approximately 2.5x bandwidth saving.
- **`concurrent_sends`**—maximum concurrent send tasks. `1` =
  strict-order delivery (the default). `> 1` requires
  `idempotent_writes: true`; `0` is rejected.
- **`poll_interval_ms`**—WAL discovery poll interval.
- **`bandwidth_schedule`**—time-of-day send rate control. See
  [Bandwidth scheduling](#bandwidth-scheduling).
- **`bandwidth_timezone`**—timezone the whole `bandwidth_schedule` is
  interpreted in. IANA name (for example, `"Asia/Kolkata"`) or
  `"utc"`.

## Performance vs. correctness

EDR's default is correctness-first: strict-order delivery. One batch is in
flight at a time (`concurrent_sends: 1`), held through retries, so data
arrives at the destination in exactly the order it was written at the
source.

When the same point (identical series key and timestamp) is written more
than once—an overwrite—InfluxDB resolves it last-write-wins by arrival
order. Any concurrency that lets batches race can deliver an overwrite
before the original it replaces. The original then arrives second and
wins, so the destination reverts to the earlier value. Nothing is lost
in transit, and every count matches, which makes this harder to detect
than data loss.

`idempotent_writes: true` is your assertion about the workload: no (series
key, timestamp) pair is ever written with differing field values. Under that
assertion, re-ordering and re-delivery cannot change the final stored
values, which is what makes the throughput features below safe. The agent
enforces the pairing at startup and on config reload—these are rejected
without the assertion:

| Feature | Why it needs the assertion |
|---|---|
| `concurrent_sends > 1` | batches race to the destination; arrival order != write order |
| `priorities` | deliberately reorders blocks within and across WAL files |
| `historic_fill: full` or `since` | backfill overlaps live replication and re-sends data |
| multiple ingest nodes | independent per-node WAL streams interleave |

**Choosing a mode:**

- **Workload has overwrites, upserts, or corrections** (or you can't rule
  them out): leave the defaults—`idempotent_writes: false`,
  `concurrent_sends: 1`, `historic_fill: { mode: none }`. Throughput is
  bounded by round-trip latency per batch; size batches up rather than
  adding concurrency.
- **Workload is append-only** (each point written once—typical
  sensor and metrics ingest): set `idempotent_writes: true` and raise
  `concurrent_sends` (for example, 4-16) for parallel delivery; historic
  fill and priorities become available.

The assertion is about the *writers*, not about EDR: if any producer can
ever rewrite a point with a different value, it is not idempotent—
regardless of how rarely it happens.

## Upstreams (destination receiving sources)

Each entry in the `upstreams` list:

- **`name`**—expected source node name (must match the source's
  `name`).
- **`auth_token`**—token store key for verifying the source's
  identity. Each upstream needs a unique auth token so the downstream
  can identify who connected.
- **`write_token`**—token store key for writing the source's data
  into local InfluxDB.

## Scope

```yaml {lint="false"}
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
dropped before queueing, so they consume no bandwidth.

`exclude:` subtracts from whatever the scope includes—the natural way to
say "replicate everything except local ops noise" without inverting the
config into an allowlist. Two trade-offs to understand before choosing this
shape:

- **It is fail-open.** Under `type: instance` with exclusions, a database
  created tomorrow replicates automatically. That is the point—but if you
  scope for compliance or data-jurisdiction reasons, prefer the fail-closed
  allowlist (`type: databases`), where new databases never leave the node
  until you name them. When a new database enters scope this way, the agent
  logs it once (`new database entered replication scope`) so automatic
  growth is visible, not silent.
- **Exclusions are validated at load.** Excluding something the include
  can't reach, excluding under `type: tables`, duplicate entries, or
  excluding every included database are all rejected with the offender
  named—a config that would silently do nothing (or everything) fails fast
  instead.

Config hot-reload picks up scope changes. Narrowing scope (adding
an exclusion) takes effect immediately. Widening scope (removing an
exclusion, adding a database) replicates new data going forward only—
historic data for the newly added entity is not backfilled; re-run
historic fill if the older data is owed.

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

- **`match.type`** (`all` \| `database` \| `tables`)—what the rule
  matches.
- **`recency`** (Duration)—optional data-time recency window; the
  rule matches only blocks whose max data time is within the window
  of now.
- **`priority`** (Integer, 1-255)—lower is more urgent. Unique values
  become dispatch tiers.
- **`share`** (Integer)—optional deficit round-robin (DRR) weight for
  this tier.
- **`historic_fill`** (Boolean)—one rule can claim historic fill
  traffic for its tier. Otherwise historic fill rides the
  lowest-priority tier.

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

- **`name`**—optional label, shown in the UI and logs.
- **`hours`**—`"HH:MM-HH:MM"`, 24-hour, in the schedule's timezone
  (see `bandwidth_timezone`). Wraps midnight (`"22:00-06:00"`).
  `"24:00"` is accepted as an end-of-day sentinel only, so a
  whole-day window can be written as `"00:00-24:00"` instead of the
  off-by-one `"00:00-23:59"`—as a *start* time it's a config error.
  Mutually exclusive with `dates`.
- **`days`**—optional list of `mon`, `tue`, `wed`, `thu`, `fri`,
  `sat`, and `sun` restricting which weekdays `hours` applies to.
  Absent = every day. A wrapping window
  (for example, `"22:00-06:00", days: [fri]`) is anchored to its
  **start day**—the post-midnight tail on Saturday still counts as
  Friday's window. Combining `days` with `dates` is a config error.
- **`dates`**—optional list of calendar-date overrides, matching the
  **whole day**: `"YYYY-MM-DD"` (one-time—this exact date only) or
  `"MM-DD"` (no year—recurs every year, for example `"12-25"`). An
  entry has either `hours` (with optional `days`) or `dates`, never
  both—combining them, or setting neither, is a config error.
- **`mode`**—`unlimited` (full speed), `limited` (throttled to
  `max_bytes_per_sec`), or `silent` (no data sends).
- **`max_bytes_per_sec`**—required for `limited`.
- **`silent_reports`**—for `silent` mode: keep sending status reports
  (default true). When false, no traffic at all—the downstream marks
  the channel unhealthy for the duration.

Entries are evaluated in order; the first matching entry wins, so more
specific rules (a weekend override, a calendar exception) must come before
the general rule they're meant to carve an exception out of. When
`bandwidth_schedule` is absent, or nothing matches at a given moment, the
pipeline runs unlimited. Data is never dropped by scheduling—it
queues during limited or silent windows and drains when the window
changes.

`bandwidth_timezone` sets the zone the whole schedule is interpreted in:
`"utc"` (the default) or an IANA name like `"Asia/Kolkata"`, which also
handles daylight-saving correctly—unlike hand-offsetting a UTC window,
which drifts an hour for half the year.

> [!Important]
> #### Bandwidth schedules changed to UTC by default at the 1.0.0 release candidate
>
> Schedules previously ran in process-local time—which was already UTC
> inside containers, and whatever the host zone happened to be on bare
> metal. If you relied on host-local hours, set `bandwidth_timezone` to that
> zone. Schedule entries also now reject unknown keys, `"24:00"` as a start
> time, two-digit years in `dates`, and an empty `days:` list—each of these
> previously mis-parsed silently.

The agent validates the schedule at load time (and on hot reload) and logs
advisory warnings—never load errors—for rules that are fully or partially
shadowed by an earlier rule, weekly coverage gaps that silently default to
unlimited, and duplicate or conflicting calendar dates. These also appear
in `/edr/v1/metrics` (`bandwidth_warnings`) and the UI.

## Direct mode

```yaml
downstream:
  name: "cloud-influx"
  address: "https://cloud.influxdata.com"
  auth_token: "cloud-api-token"
  mode: direct
```

When the destination does not run an EDR agent, replicate directly to a
plain InfluxDB v3 write endpoint. In direct mode there is no `/connect`
handshake, health checks use the destination's `GET /health`, and no
topology is propagated. Auth failures and schema conflicts are handled
identically to agent-to-agent mode. The `pt` wire encoding is not available
in direct mode.

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
