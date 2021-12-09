---
title: influx task log list
description: The `influx task log list` command outputs log information related to a task.
menu:
  influxdb_2_1_ref:
    name: influx task log list
    parent: influx task log
weight: 301
aliases:
  - /influxdb/v2.1/reference/cli/influx/task/log/list
---

The `influx task log list` command outputs log information related to a task.

## Usage
```
influx task log list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--run-id`        | Run ID                                                                | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
|      | `--task-id`       | ({{< req >}}) Task ID                                                 | string     |                       |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### List logs from all task executions
```sh
influx task log list --task-id 0Xx0oox00XXoxxoo1
```

##### List logs from a specific task execution
```sh
influx task log list \
  --task-id 0Xx0oox00XXoxxoo1 \
  --run-id ox0Xx0ooxx00XXoo2
```
