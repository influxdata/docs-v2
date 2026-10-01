---
title: Install EDR
description: >
  Install the EDR agent and triage CLI binaries, confirm your InfluxDB 3
  Enterprise version meets EDR's requirements, and configure the agent's
  CLI flags.
menu:
  influxdb3_edr:
    name: Install
weight: 2
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/configuration.md -->

EDR ships as pre-built binaries. You don't build anything from source.

1. [Binaries](#binaries)
2. [Requirements](#requirements)
3. [Confirm your version](#confirm-your-version)
4. [Configure EDR](#configure-edr)
5. [Run EDR in Docker](#run-edr-in-docker)

## Binaries

| Binary | What it is |
|---|---|
| `influxdb3` | InfluxDB 3 Enterprise server (built and shipped by InfluxData). |
| `influxdb3-edr` | The EDR agent. Runs one process per node that participates in replication. |
| `edr-inspect` | Read-only triage CLI (`state`, `metrics`, and `topology`). See [Monitor EDR](/influxdb3/edr/monitor/#triage-cli-edr-inspect). |

Place the binaries on each host—on `PATH`, or referenced by an absolute
path in your service definitions. EDR has no other runtime dependencies.

> [!Note]
> #### EDR version support
>
> EDR requires InfluxDB 3 Enterprise 3.10.x or later. See
> [Compatibility](/influxdb3/edr/reference/compatibility/) for the
> supported storage-format matrix.

## Requirements

The `influxdb3` server must run the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)—the
default for new clusters on 3.11+. On 3.10.x, pass `--upgrade-pacha-tree`
to migrate the cluster. EDR reads the upgraded engine's object store
directly, so without it,
[write-ahead log (WAL)](/influxdb3/edr/reference/glossary/#wal-write-ahead-log)
files are in a format EDR ignores.

Run one `influxdb3-edr` agent per node that sources or receives data. Each
agent needs a token store directory and a config file—see
[Configure EDR](#configure-edr).

## Confirm your version

```bash
influxdb3 --version
influxdb3-edr --version
```

## Configure EDR

Every `influxdb3-edr` agent needs a config file, a token store, and the
following CLI flags:

```bash
influxdb3-edr \
  --config /etc/edr/config.yaml \
  --data-dir /var/lib/influxdb3 \
  --token-store /etc/edr/secrets \
  --state-location /var/lib/edr/state \
  --listen 0.0.0.0:9090
```

| Flag | Description |
|---|---|
| `--data-dir` | InfluxDB data directory (the shared object store). |
| `--token-store` | Path to the token store directory. See [Manage tokens](/influxdb3/edr/manage-tokens/). |
| `--state-location` | Where the agent persists replication state. See [State and recovery](/influxdb3/edr/reference/state-and-recovery/). |
| `--listen` | Network listener for the replication protocol. Defaults to `0.0.0.0:9090`. |

For the replication topology config (`downstream:` and `upstreams:`), see
[Get started](/influxdb3/edr/get-started/). For the complete CLI flag
reference, see [CLI reference](/influxdb3/edr/reference/cli/). For the
complete config file schema, see
[Configuration file reference](/influxdb3/edr/reference/config-file/).

## Run EDR in Docker

The agent and `edr-inspect` also ship as a container image. For
operating that image—ports, mounts, the environment contract, and triage
through `docker exec`—see [Run EDR in Docker](/influxdb3/edr/install/docker/).

{{< page-nav next="/influxdb3/edr/get-started/" nextText="Get started with EDR" >}}
