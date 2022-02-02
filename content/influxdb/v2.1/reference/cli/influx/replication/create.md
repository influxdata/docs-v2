---
title: influx replication create
description: Create a new InfluxDB replication stream.
menu:
  influxdb_2_1_ref:
    name: influx replication create
    parent: influx replication
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

The `influx replication create` command creates a new InfluxDB replication stream.

## Usage
```   
influx replication create [command options] [arguments...]
```

## Flags

| Flag |                                | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :----------------------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-n` | `--name`                       | Replication stream name                                               |   string   |                       |
| `-d` | `--description`                | Replication stream description                                        |   string   |                       |
|      | `--org-id`                     | Local organization ID                                                 |   string   | `INFLUX_ORG_ID`       |
| `-o` | `--org`                        | Local organization name                                               |   string   | `INFLUX_ORG`          |
|      | `--remote-id`                  | Remote connection ID to replicate data to                             |   string   |                       |
|      | `--local-bucket`               | Local bucket ID to replicate data from                                |   string   |                       |
|      | `--remote-bucket`              | Remote bucket ID to replicate data to                                 |   string   |                       |
|      | `--max-queue-bytes`            | Max queue size in bytes (default: `67108860`)                         |  integer   |                       |
|      | `--drop-non-retryable-data`    | Drop data when a non-retryable error is encountered                   |            |                       |
|      | `--no-drop-non-retryable-data` | Do not drop data when a non-retryable error is encountered            |            |                       |
|      | `--host`                       | InfluxDB HTTP address (default `http://localhost:8086`)               |   string   | `INFLUX_HOST`         |
|      | `--skip-verify`                | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--configs-path`               | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-c` | `--active-config`              | CLI configuration to use for command                                  |   string   |                       |
|      | `--http-debug`                 | Inspect communication with InfluxDB servers                           |   string   |                       |
|      | `--json`                       | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--hide-headers`               | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
| `-t` | `--token`                      | InfluxDB API token                                                    |   string   | `INFLUX_TOKEN`        |
