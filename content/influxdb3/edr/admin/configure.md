---
title: Configure EDR
description: >
  Create a token store and config file for an EDR agent, and understand the
  performance vs. correctness trade-off behind idempotent writes.
menu:
  influxdb3_edr:
    name: Configure
    parent: Manage
weight: 102
---

Every `influxdb3-edr` agent needs a token store directory and a config file.
This page walks through creating both. For the complete CLI flag reference,
see [CLI reference](/influxdb3/edr/reference/cli/). For the complete config
file schema, see [Configuration file reference](/influxdb3/edr/reference/config-file/).

## Create a token store

```bash
mkdir -p /etc/edr/secrets

# Auth token—identifies this source to the destination.
# Generate a unique token per source node.
openssl rand -hex 32 > /etc/edr/secrets/my-auth-token

# Write token—used by the destination's EDR agent to write into its
# local InfluxDB. Typically the destination's InfluxDB admin/operator token.
cp /path/to/destination-write-token /etc/edr/secrets/dest-write-token
```

The token store is a directory of plain-text files: file name = token
reference, content = secret (whitespace-trimmed). Keep files `chmod 600`.
For rotation, ownership, and Vault guidance, see
[Manage tokens](/influxdb3/edr/admin/manage-tokens/).

## Create a config file

A minimal source-node config:

```yaml
# /etc/edr/config.yaml -- source node
name: "factory-floor-01"

location:
  label: "Building A, Floor 3"
  lat: 51.5074
  lng: -0.1278

downstream:
  name: "regional-hub"
  address: "http://hub.internal:9090"
  auth_token: "my-auth-token"         # name of file in token store
  historic_fill:
    mode: none                       # required -- choose: none | full | since
  comms:
    interval_secs: 10
    degraded_after: 3
    unhealthy_after: 6
  retry:
    initial_backoff_secs: 1
    max_backoff_secs: 30
    multiplier: 2
```

A minimal destination-node config:

```yaml
# /etc/edr/config.yaml -- destination node
name: "regional-hub"

upstreams:
  - name: "factory-floor-01"
    auth_token: "factory-01-auth"      # verifies the source's identity
    write_token: "dest-write-token"    # used to write into local InfluxDB
  - name: "factory-floor-02"
    auth_token: "factory-02-auth"
    write_token: "dest-write-token"
```

A node needs at least one of `downstream`/`downstreams` (where it sends
data) or `upstreams` (who sends it data). A node with both is a regional
hub. `historic_fill` is required on every `downstream` entry—there is no
default; the agent refuses to start without it. See
[Configuration file reference](/influxdb3/edr/reference/config-file/) for
every field.

## Start the agents

```bash
# Source node:
influxdb3-edr \
  --config /etc/edr/config.yaml \
  --data-dir /var/lib/influxdb3 \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9090 \
  --state-location /var/lib/edr/state \
  --poll-interval-ms 1000

# Destination node:
EDR_WRITE_ENDPOINT="http://localhost:8181" \
influxdb3-edr \
  --config /etc/edr/config.yaml \
  --data-dir /var/lib/influxdb3 \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9090 \
  --state-location /var/lib/edr/state
```

Open `http://127.0.0.1:9091/ui` to verify—the embedded UI shows topology,
health, replication lag, and data-flow metrics. The UI and `/metrics` bind
to loopback by default (`--observability-listen`); expose them deliberately
if you need off-host access. See [Monitor EDR](/influxdb3/edr/admin/monitor/).

## Performance vs. correctness (`idempotent_writes` and `concurrent_sends`)

EDR's default is correctness-first: strict-order delivery. One batch is in
flight at a time (`concurrent_sends: 1`), held through retries, so data
arrives at the destination in exactly the order it was written at the
source.

Why this matters: when the same point (identical series key + timestamp) is
written more than once—an overwrite—InfluxDB resolves it last-write-wins
by arrival order. Any concurrency that lets batches race can deliver an
overwrite *before* the original it replaces; the original then lands second
and silently wins. The data isn't lost in transit—it's reverted at the
destination, which is worse, because every count matches.

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
| `historic_fill: full`/`since` | backfill overlaps live replication and re-sends data |
| multiple ingest nodes | independent per-node WAL streams interleave |

**Choosing a mode:**

- **Workload has overwrites, upserts, or corrections** (or you can't rule
  them out): leave the defaults—`idempotent_writes: false`,
  `concurrent_sends: 1`, `historic_fill: { mode: none }`. Throughput is
  bounded by round-trip latency per batch; size batches up rather than
  adding concurrency.
- **Workload is append-only** (each point written once—typical
  sensor/metrics ingest): set `idempotent_writes: true` and raise
  `concurrent_sends` (for example, 4-16) for parallel delivery; historic
  fill and priorities become available.

The assertion is about the *writers*, not about EDR: if any producer can
ever rewrite a point with a different value, it is not idempotent—
regardless of how rarely it happens.

## Scope

Restrict what a node replicates with the `scope` block on `downstream`:

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

# Exclusions also compose with a database allowlist:
scope:
  type: databases
  names: [sensors, metrics]
  exclude:
    tables:
      - database: sensors
        table: debug_log
```

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

Scope changes are picked up by config hot-reload. Narrowing scope (adding an
exclusion) takes effect immediately. Widening scope (removing an exclusion,
adding a database) replicates new data going forward only—historic data
for the newly added entity is not backfilled; re-run historic fill if the
older data is owed.

## Configuration reload

The config file is polled for changes. Reloadable without restart: scope,
comms expectations, retry parameters. Requiring a restart: node name,
upstream list, destination address, destination mode, `idempotent_writes`,
priority rules, token store path, data directory, listen address. The agent
logs the reason when a change is rejected for hot-reload.

## Bandwidth scheduling

The `bandwidth_schedule` list on the downstream config gives time-of-day
control over the send rate:

```yaml
downstream:
  # ... name, address, auth_token ...
  bandwidth_timezone: "Europe/London"   # optional; default "utc"
  bandwidth_schedule:
    # First match wins -- exceptions BEFORE the general rules they carve
    # out of.
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

Entries are evaluated in order; the first matching entry wins, so more
specific rules (a weekend override, a calendar exception) must come before
the general rule they're meant to carve an exception out of. When
`bandwidth_schedule` is absent, or nothing matches at a given moment, the
pipeline runs unlimited. Data is never dropped by scheduling—it queues
during limited/silent windows and drains when the window changes.

`bandwidth_timezone` sets the zone the whole schedule is interpreted in:
`"utc"` (the default) or an IANA name like `"Asia/Kolkata"`, which also
handles daylight-saving correctly—unlike hand-offsetting a UTC window,
which drifts an hour for half the year.

> [!Important]
> #### Bandwidth schedules changed to UTC by default at the 1.0.0 release candidate
> Schedules previously ran in process-local time—which was already UTC
> inside containers, and whatever the host zone happened to be on bare
> metal. If you relied on host-local hours, set `bandwidth_timezone` to that
> zone. Schedule entries also now reject unknown keys, `"24:00"` as a start
> time, two-digit years in `dates`, and an empty `days:` list—each of these
> previously mis-parsed silently.

The agent validates the schedule at load time (and on hot reload) and logs
advisory warnings—never load errors—for rules that are fully or partially
shadowed by an earlier rule, weekly coverage gaps that silently default to
unlimited, and duplicate/conflicting calendar dates. These also appear in
`/edr/v1/metrics` (`bandwidth_warnings`) and the UI. For the complete field
reference, see
[Configuration file reference](/influxdb3/edr/reference/config-file/#bandwidth-scheduling).

## Direct mode

When the destination does not run an EDR agent, replicate directly to a
plain InfluxDB v3 write endpoint:

```yaml
downstream:
  name: "cloud-influx"
  address: "https://cloud.influxdata.com"
  auth_token: "cloud-api-token"
  mode: direct
```

In direct mode there is no `/connect` handshake, health checks use the
destination's `GET /health`, and no topology is propagated. Auth failures
and schema conflicts are handled identically to agent-to-agent mode. The
`pt` wire encoding is not available in direct mode.
