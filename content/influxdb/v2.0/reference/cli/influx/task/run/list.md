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

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--after`         | After-time for filtering                                              | string     |                       |
|      | `--before`        | Before-time for filtering                                             | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--limit`         | Limit the number of results                                           | integer    |                       |
|      | `--run-id`        | Run ID                                                                | string     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
|      | `--task-id`       | ({{< req >}}) Task ID                                                 | string     |                       |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

- [List all runs of a task](#list-all-runs-of-a-task)
- [List a specific run of a task](#list-a-specific-run-of-a-task)
- [Limit the number of returned task runs to 20](#limit-the-number-of-returned-task-runs-to-20)

##### List all runs of a task
```sh
influx task run list --task-id 0Xx0oox00XXoxxoo1
```

##### List a specific run of a task
```sh
influx task run list \
  --task-id 0Xx0oox00XXoxxoo1 \
  --run-id ox0Xx0ooxx00XXoo2
```

##### Limit the number of returned task runs to 20
```sh
influx task run list \
  --task-id 0Xx0oox00XXoxxoo1 \
  --limit 20
```
