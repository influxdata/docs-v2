---
title: influxd run
description: The `influxd run` command is the default `influxd` command and starts the influxd server.
v2.0/tags: [influxd, cli]
menu:
  v2_0_ref:
    name: run
    parent: influxd
weight: 201
---

The `influxd run` command is the default command for `influxd`.
It starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd run [flags]
```

{{% note %}}
Because `run` is the default command for `influxd`, the following commands are the same:

```bash
influxd
influxd run
```
{{% /note %}}

## Flags

| Flag                   | Description                                                                            | Input type |
| :--------------------- | :------------------------------------------------------------------------------------- | :--------: |
| `--assets-path`        | Override default assets by serving from a specific directory (developer mode)          | string     |
| `--bolt-path`          | Path to boltdb database (default `~/.influxdbv2/influxd.bolt`)                         | string     |
| `--e2e-testing`        | Add /debug/flush endpoint to clear stores; used for end-to-end tests (default `false`) | boolean    |
| `--engine-path`        | Path to persistent engine files (default `~/.influxdbv2/engine`)                       | string     |
| `-h`, `--help`         | Help for `run`                                                                     |            |
| `--http-bind-address`  | Bind address for the REST HTTP API (default `:9999`)                                   | string     |
| `--log-level`          | Supported log levels are debug, info, and error (default `info`)                       | string     |
| `--reporting-disabled` | Disable sending telemetry data to https://telemetry.influxdata.com                     |            |
| `--secret-store`       | Data store for secrets (bolt or vault) (default `bolt`)                                | string     |
| `--store`              | Data store for REST resources (bolt or memory) (default `bolt`)                        | string     |
| `--tracing-type`       | Supported tracing types (log or jaeger)                                                | string     |
