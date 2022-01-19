---
title: influx replication list
description: Manage replication connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx replication list
    parent: influx replication
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

List all replication streams and corresponding metrics.

## Usage
```
influx replication list [command options] [arguments...]
```

## Flags

| `-n` | `--name`         | Filter results to only replication streams with a specific name             | string |                 |
|      | `--org-id`       | Local org ID                                                                | string | `INFLUX_ORG_ID` |
| `-o` | `--org`          | Local org name                                                              | string | `INFLUX_ORG`    |
|      | `--remote-id`    | Filter results to only replication streams for a specific remote connection | string |                 |
|      | `--local-bucket` | Filter results to only replication streams for a specific local bucket      | string |                 |

|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                  | string | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                           |        | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)       | string | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                        | string |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                                | string |                       |
|      | `--json`          | Output data as JSON (default `false`)                                       |        | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                        |        | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | API token                                                                   | string | `INFLUX_TOKEN`        | 
