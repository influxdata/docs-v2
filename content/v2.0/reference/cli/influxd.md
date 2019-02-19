---
title: influxd - InfluxDB daemon
seotitle: influxd - InfluxDB daemon
description: The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
  v2_0_ref:
    name: influxd
    parent: Command line tools
weight: 102
---

The `influxd` daemon starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [flags]
```

## Flags

| Flag                   | Description                                                                            | Input type |
| :--------------------- | :------------------------------------------------------------------------------------- | :--------: |
| `--bolt-path`          | Path to boltdb database (default `~/.influxdbv2/influxd.bolt`)                         |   string   |
| `--developer-mode`     | Serve assets from the local filesystem in developer mode                               |            |
| `--engine-path`        | Path to persistent engine files (default `~/.influxdbv2/engine`)                       |   string   |
| `-h`, `--help`         | Help for `influxd`                                                                     |            |
| `--http-bind-address`  | Bind address for the REST HTTP API (default `:9999`)                                   |   string   |
| `--log-level`          | Supported log levels are debug, info, and error (default `info`)                       |   string   |
| `--reporting-disabled` | Disable sending telemetry data to https://telemetry.influxdata.com                     |            |
| `--protos-path`        | Path to protos on the filesystem (default `~/.influxdbv2/protos`)                      |   string   |
| `--secret-store`       | Data store for secrets (bolt or vault) (default `bolt`)                                |   string   |
| `--assets-path`        | Override default assets by serving from a specific directory (default `memory`)        |   string   |
| `--store`              | Data store for REST resources (bolt or memory) (default `bolt`)                        |   string   |
| `--e2e-testing`        | Add /debug/flush endpoint to clear stores; used for end-to-end tests (default `false`) |  boolean   |
