---
title: influx task list
description: The `influx task list` command lists and searches for tasks in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx task list
    parent: influx task
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/task/find
---

The `influx task list` command lists and searches for tasks in InfluxDB.

## Usage
```
influx task list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `list` command                                           |             |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`            | Task ID                                                               | string      |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
|      | `--limit`         | Number of tasks to find (default `100`)                               | integer     |                       |
| `-o` | `--org`           | Task organization name                                                | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Task organization ID                                                  | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
| `-n` | `--user-id`       | Task owner ID                                                         | string      |                       |

## Examples

{{< cli/influx-creds-note >}}

- [List all tasks](#list-all-tasks)
- [List a specific task](#list-a-specific-task)
- [Limit the number of tasks returned to 20](#limit-the-number-of-tasks-returned-to-20)
- [List all tasks created by a specific user](#list-all-tasks-created-by-a-specific-user)

##### List all tasks
```sh
influx task list
```

##### List a specific task
```sh
influx task list --id 0Xx0oox00XXoxxoo1
```

##### Limit the number of tasks returned to 20
```sh
influx task list --limit 20
```

##### List all tasks created by a specific user
```sh
influx task list --user-id 0Xx0oox00XXoxxoo1
```