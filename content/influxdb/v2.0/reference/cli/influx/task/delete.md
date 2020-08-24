---
title: influx task delete
description: The `influx task delete` command deletes a task in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx task delete
    parent: influx task
weight: 201
aliases:
  - /v2.0/reference/cli/influx/task/delete/
---

The `influx task delete` command deletes a task in InfluxDB.

## Usage
```
influx task delete [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `delete` command                                         |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`           | **(Required)** Task ID                                                | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
