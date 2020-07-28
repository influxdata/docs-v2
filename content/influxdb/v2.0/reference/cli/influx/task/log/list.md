---
title: influx task log list
description: The `influx task log list` command outputs log information related to a task.
menu:
  v2_0_ref:
    name: influx task log list
    parent: influx task log
weight: 301
aliases:
  - /v2.0/reference/cli/influx/task/log/list
  - /v2.0/reference/cli/influx/task/log/find
---

The `influx task log list` command outputs log information related to a task.

## Usage
```
influx task log list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `list` command                                           |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `INFLUX_HOST`         |
|      | `--run-id`       | Run ID                                                                | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
|      | `--task-id`      | **(Required)** Task ID                                                | string      |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
