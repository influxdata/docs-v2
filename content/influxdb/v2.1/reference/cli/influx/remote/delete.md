---
title: influx remote delete
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote delete
    parent: influx remote
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Delete an existing remote connection.

## Usage
```
influx remote delete [command options] [arguments...]
```

## Flags

| Flag |        | Description                               | Input type | {{< cli/mapped >}} |
|:-----|:-------|:------------------------------------------|:----------:|:-------------------|
| `-i` | `--id` | ID of the remote connection to be deleted |            |                    |

|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
