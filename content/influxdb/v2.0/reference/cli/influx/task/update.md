---
title: influx task update
description: The `influx task update` command updates information related to tasks in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx task update
    parent: influx task
weight: 201
---

The `influx task update` command updates information related to tasks in InfluxDB.

## Usage
```
influx task update [task literal] [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Path to Flux script file                                              |   string   |                       |
| `-h` | `--help`          | Help for the `update` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          |   string   |                       |
| `-i` | `--id`            | ({{< req >}}) Task ID                                                 |   string   |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
|      | `--status`        | Update task status (`active` or `inactive`)                           |   string   |                       |
| `-t` | `--token`         | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

- [Update a task from a Flux string](#update-a-task-from-a-flux-string)
- [Update a task from a Flux file](#update-a-task-from-a-flux-file)
- [Enable a task](#enable-a-task)
- [Disable a task](#disable-a-task)

##### Update a task from a Flux string
```sh
export UPDATED_FLUX_TASK='
  option task = {
    name: "Example Task",
    every: 1d
  }

  from(bucket: "example-bucket")
    |> range(start: -task.every)
    |> filter(fn: (r) => (r._measurement == "m")
    |> aggregateWindow(every: 1h, fn: mean)
    |> to(bucket: "default-ds-1d", org: "my-org")
'

influx task update $UPDATED_FLUX_TASK
```

##### Update a task from a Flux file
```sh
influx task update --file /path/to/example-task.flux
```

##### Enable a task
```sh
influx task update --status active
```

##### Disable a task
```sh
influx task update --status inactive
```