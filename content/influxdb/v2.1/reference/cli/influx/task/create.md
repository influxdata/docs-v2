---
title: influx task create
description: The `influx task create` command creates a task in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx task create
    parent: influx task
weight: 201
---

The `influx task create` command creates a task in InfluxDB.

## Usage
```
influx task create [task literal] [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Path to Flux script file                                              | string     |                       |
| `-h` | `--help`          | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

##### Create a task using raw Flux
```sh
export FLUX_TASK='
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

influx task create $FLUX_TASK
```

##### Create a task from a file
```sh
influx task create --file /path/to/example-task.flux
```
