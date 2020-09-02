---
title: influx task run list
description: The `influx task run list` command outputs information related to runs of a task.
menu:
  influxdb_2_0_ref:
    name: influx task run list
    parent: influx task run
weight: 301
aliases:
  - /influxdb/v2.0/reference/cli/influx/task/run/find
---

The `influx task run list` command outputs information related to runs of a task.

## Usage
```
influx task run list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--after`        | After-time for filtering                                              | string      |                       |
|      | `--before`       | Before-time for filtering                                             | string      |                       |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `list` command                                           |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
|      | `--limit`        | Limit the number of results                                           | integer     |                       |
|      | `--run-id`       | Run ID                                                                | string      |                       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
|      | `--task-id`      | **(Required)** Task ID                                                | string      |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
