---
title: Install EDR
description: >
  Install the EDR agent and triage CLI binaries and confirm your InfluxDB 3
  Enterprise version meets EDR's requirements.
menu:
  influxdb3_edr:
    name: Install
    parent: Manage
weight: 101
---

EDR ships as pre-built binaries—you do not build anything from source:

| Binary | What it is |
|---|---|
| `influxdb3` | InfluxDB 3 Enterprise server (built and shipped by InfluxData). This EDR release targets InfluxDB 3 Enterprise 3.11 (v0.2.0 targeted 3.10). |
| `influxdb3-edr` | The EDR agent—one process per node that participates in replication. |
| `edr-inspect` | Read-only triage CLI (`state` / `metrics` / `topology`). See [Monitor EDR](/influxdb3/edr/admin/monitor/#triage-cli-edr-inspect). |

Place the binaries on each host (on `PATH`, or referenced by absolute path in
your service definitions). EDR has no other runtime dependencies.

## Requirements

- The `influxdb3` server must run the PachaTree storage engine (the default
  for new clusters on 3.11+; on 3.10.x pass `--use-pacha-tree`)—EDR reads
  the PachaTree object store directly; without it, WAL files are in a format
  EDR ignores.
- Run one `influxdb3-edr` agent per node that sources or receives data.
- Each agent needs a token store directory and a config file. See
  [Configure EDR](/influxdb3/edr/admin/configure/).

Confirm the versions you received:

```bash
influxdb3 --version
influxdb3-edr --version
```

## Running in Docker?

The agent and `edr-inspect` also ship as a container image. For operating
that image (ports, mounts, the environment contract, triage via
`docker exec`), see [Run EDR in Docker](/influxdb3/edr/admin/run-in-docker/).
