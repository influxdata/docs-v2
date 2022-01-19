---
title: influx replication create
description: Manage replication connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx replication create
    parent: influx replication
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

Create a new replication stream.

## Usage
```   
influx replication create [command options] [arguments...]
```

## Flags

| Flag |          | Description                        | Input type | {{< cli/mapped >}} |
|:-----|:---------|:-----------------------------------|:----------:|:-------------------|
| `-n` | `--name`                       | Name for new replication stream                                         | string |                 |
| `-d` | `--description`                | Description for new replication stream                                  | string |                 |
|      | `--org-id`                     | The ID of the local organization                                        | string | `INFLUX_ORG_ID` |
| `-o` | `--org`                        | The name of the local organization                                      | string | `INFLUX_ORG`    |
|      | `--remote-id`                  | Remote connection the new replication stream should send data to        | string |                 |
|      | `--local-bucket`               | ID of local bucket data should be replicated from                       | string |                 |
|      | `--remote-bucket`              | ID of remote bucket data should be replicated to                        | string |                 |
|      | `--max-queue-bytes`            | Max queue size in bytes (default: 67108860)                             |        |                 |
|      | `--drop-non-retryable-data`    | Drop data when a non-retryable error is encountered instead of retrying |        |                 |
|      | `--no-drop-non-retryable-data` | Do not drop data when a non-retryable error is encountered              |        |                 |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
