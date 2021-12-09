---
title: influx replication update
description: Manage replication connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx replication update
    parent: influx replication
weight: 102
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

   influx replication update - Update an existing replication stream

USAGE:
   influx replication update [command options] [arguments...]

OPTIONS:
   --id value, -i value           ID of the replication stream to be updated
   --name value, -n value         New name for the replication stream
   --description value, -d value  New description for the replication stream
   --remote-id value              New ID of remote connection the replication stream should send data to
   --remote-bucket value          New ID of remote bucket that data should be replicated to
   --max-queue-bytes value        New max queue size in bytes (default: 0)
   --drop-non-retryable-data      Drop data when a non-retryable error is encountered instead of retrying
   --no-drop-non-retryable-data   Do not drop data when a non-retryable error is encountered

|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
