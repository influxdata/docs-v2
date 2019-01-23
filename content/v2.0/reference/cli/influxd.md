---
title: influxd - InfluxDB daemon
seotitle: influxd - InfluxDB daemon
description: The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
  v2_0_ref:
    name: influxd
    parent: Command line tools
    weight: 2
---

The `influxd` daemon starts and runs all the processes necessary for InfluxDB to function.

## Usage
```
influxd [flags]
```

## Flags
| Flag                   | Description                                                          | Input type |
|:----                   |:-----------                                                          |:----------:|
| `--bolt-path`          | Path to boltdb database (default `~/.influxdbv2/influxd.bolt`)       | string     |
| `--developer-mode`     | Serve assets from the local filesystem in developer mode             |            |
| `--engine-path`        | Path to persistent engine files (default `~/.influxdbv2/engine`)     | string     |
| `-h`, `--help`         | Help for `influxd`                                                   |            |
| `--http-bind-address`  | Bind address for the REST HTTP API (default `:9999`)                 | string     |
| `--log-level`          | Supported log levels are debug, info, and error (default `info`)     | string     |
| `--nats-path`          | Path to NATS queue for scraping tasks (default `~/.influxdbv2/nats`) | string     |
| `--reporting-disabled` | Disable sending telemetry data to https://telemetry.influxdata.com   |            |
| `--protos-path`        | Path to protos on the filesystem (default `~/.influxdbv2/protos`)    | string     |
| `--secret-store`       | Data store for secrets (bolt or vault) (default `bolt`)              | string     |
