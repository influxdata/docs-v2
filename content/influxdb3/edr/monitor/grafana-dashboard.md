---
title: Grafana dashboard
description: >
  Deploy the ready-made Telegraf and Grafana pipeline that turns EDR's
  metrics endpoint into a fleet-level dashboard.
menu:
  influxdb3_edr:
    name: Grafana dashboard
    parent: Monitor
weight: 2
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/operations.md -->

1. [Exclude the metrics database from replication](#1-exclude-the-metrics-database-from-replication)
2. [Create the metrics database](#2-create-the-metrics-database)
3. [Configure Telegraf](#3-configure-telegraf)
4. [Configure Grafana](#4-configure-grafana)
5. [Verify](#5-verify)

A ready-made Grafana dashboard turns EDR's `/metrics` endpoint (see
[Endpoints](/influxdb3/edr/monitor/#endpoints)) into a fleet-level
headline, a per-channel status table, and time-series detail. The pipeline
is Telegraf (scrapes `/metrics`) to a local InfluxDB database to Grafana.
The config and dashboard files ship in two places—the `observability/`
folder at the top of the EDR documentation bundle, and (the same files)
`signals-demo/observability/` inside the demo bundle, where the demo's
optional observability overlay mounts them. They're generic: nothing in
them is demo-specific, so use either copy for a production deployment.

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

## 1. Exclude the metrics database from replication

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

If you're already scoping to specific databases (`type: databases`),
leave `internal_edr` off the list—an allowlist that doesn't name it already
keeps it local.

## 2. Create the metrics database

On this node's InfluxDB, create a database named `internal_edr` (or your own
name—keep `telegraf.conf`'s `bucket` and the datasource's `dbName` in sync
if you rename it) to hold Telegraf's writes.

## 3. Configure Telegraf

Point Telegraf at the shipped `observability/telegraf/telegraf.conf`
unmodified—don't write your own—and set the environment variables it
expects before starting it:

| Variable | Example | Purpose |
|---|---|---|
| `EDR_METRICS_URL` | `http://localhost:9091/metrics` | This node's EDR agent, observability listener |
| `INFLUX_WRITE_URL` | `http://localhost:8181` | This node's InfluxDB |
| `INFLUX_ADMIN_TOKEN` | — | This InfluxDB instance's admin token |
| `EDR_SCRAPE_INTERVAL` | `10s` (default) | Optional. Scrape **and** flush cadence—see below. |

```bash { placeholders="ADMIN_TOKEN" }
EDR_METRICS_URL=http://localhost:9091/metrics \
INFLUX_WRITE_URL=http://localhost:8181 \
INFLUX_ADMIN_TOKEN=ADMIN_TOKEN \
telegraf --config observability/telegraf/telegraf.conf
```

`EDR_SCRAPE_INTERVAL` is the only knob that governs dashboard freshness: the
status panels read the latest sample per channel with no averaging window,
so the dashboard reflects a channel's real health within one scrape
interval of the agent deciding it. The default `10s` suits a production
fleet; drop it to `1s`-`2s` for a near-live view (`/metrics` is cheap to
generate). It does **not** change how quickly the agent itself declares a
channel degraded or down—that is the `comms` anti-flap window on the
sending node (`comms.interval_secs`, `degraded_after`, and
`unhealthy_after` in
[Configuration file reference](/influxdb3/edr/reference/config-file/)).

> [!Important]
> If you adapt the file, keep `name_override = "edr"` in the
> `[[inputs.prometheus]]` block—every dashboard query is `FROM "edr"`;
> without it Telegraf writes to its default measurement name (`prometheus`)
> and every panel silently shows no data.

## 4. Configure Grafana

Mount `observability/grafana/provisioning/` and
`observability/grafana/dashboards/` at the paths Grafana expects
(`/etc/grafana/provisioning/datasources/`,
`/etc/grafana/provisioning/dashboards/`, and the folder `dashboards.yml`'s
`path` points at), and set two environment variables for the Grafana
process before starting it. They're read from `${INFLUX_QUERY_URL}` and
`${INFLUX_ADMIN_TOKEN}` placeholders inside
`grafana/provisioning/datasources/internal_edr.yml`, which Grafana expands
from its own environment at startup—the same admin token as step 3, not a
separate one:

| Variable | Example | Purpose |
|---|---|---|
| `INFLUX_QUERY_URL` | `http://localhost:8181` | This node's InfluxDB |
| `INFLUX_ADMIN_TOKEN` | — | This InfluxDB instance's admin token |

```bash { placeholders="ADMIN_TOKEN" }
INFLUX_QUERY_URL=http://localhost:8181 \
INFLUX_ADMIN_TOKEN=ADMIN_TOKEN \
grafana-server --homepath /usr/share/grafana
```

The dashboard itself loads automatically on startup—`dashboards.yml`
points Grafana at the mounted `grafana/dashboards/edr-overview.json`, no
manual import needed.

A worked example ships with the
[signals demo](/influxdb3/edr/demo/)—its optional
`compose.observability.yaml` overlay gives every one of the four nodes
this same Telegraf and Grafana pipeline (`demo/signals-demo/` in the
source repository).

## 5. Verify

Open Grafana and confirm the fleet headline row shows a healthy count. If
every panel is empty:

- Check Telegraf's logs for scrape or write errors, and confirm
  `name_override = "edr"` is set.
- Confirm the datasource's token has read access to `internal_edr`.
- Confirm the EDR agent's observability listener is reachable from wherever
  Telegraf runs (loopback by default—see
  [Endpoints](/influxdb3/edr/monitor/#endpoints)).

### What you'll see

| Tier | Shows |
|---|---|
| Fleet headline | Healthy and unhealthy counts, upstream and downstream |
| Channel status table | Exactly one row per channel—network and application health, status |
| Detail — upstream (selectable per upstream) | Bytes received/sec, write failures & columns dropped |
| Detail — downstream (totals across all destinations) | Bytes sent/sec, pending backlog, WAL backlog, gaps, halted state per destination |

Terminology matches the rest of this guide: **upstream** channels are nodes
sending data to this node; **downstream** is where this node sends data to.

The headline and status-table panels show **current** state—each reads the
latest sample per channel with no averaging window—so they track the
agent's own health within one `EDR_SCRAPE_INTERVAL`, never show a channel in
two states at once, and clear the moment a recovery is scraped. The
time-series detail panels are historical, as usual.
