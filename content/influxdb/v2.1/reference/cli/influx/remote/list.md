---
title: influx remote list
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote list
    parent: influx remote
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

List all remote connections.

## Usage

```
influx remote list [command options] [arguments...]
```

## Flags

| Flag |                | Description                                                  | Input type | {{< cli/mapped >}} |
|:-----|----------------|--------------------------------------------------------------|------------|--------------------|
| `-n` | `--name`       | Filter results to only connections with a specific name      |            |                    |
|      | `--org-id`     | Local org ID [$INFLUX_ORG_ID]                                |            |                    |
| `-o` | `--org`        | Local org name [$INFLUX_ORG]                                 |            |                    |
|      | `--remote-url` | Filter results to only connections for a specific remote URL |            |                    |

|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
