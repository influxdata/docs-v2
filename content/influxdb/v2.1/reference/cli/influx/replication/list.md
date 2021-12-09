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

NAME:
   influx replication list - List all replication streams and corresponding metrics

USAGE:
   influx replication list [command options] [arguments...]

OPTIONS:
   --name value, -n value  Filter results to only replication streams with a specific name
   --org-id value          Local org ID [$INFLUX_ORG_ID]
   --org value, -o value   Local org name [$INFLUX_ORG]
   --remote-id value       Filter results to only replication streams for a specific remote connection
   --local-bucket value    Filter results to only replication streams for a specific local bucket


|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
