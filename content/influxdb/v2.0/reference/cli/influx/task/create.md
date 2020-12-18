---
title: influx task create
description: The `influx task create` command creates a new task in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx task create
    parent: influx task
weight: 201
---

The `influx task create` command creates a new task in InfluxDB.

## Usage
```
influx task create [task literal] [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------:|:--------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-f` | `--file`          | Path to Flux script file                                              | string     |                       |
| `-h` | `--help`          | Help for the `create` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name                                                     | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID                                                       | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  | string     | `INFLUX_TOKEN`        |

## Example

{{< cli/influx-creds-note >}}

##### Create a new task from a Flux string
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

##### Create a new task from a Flux file
```sh
influx task create --file /path/to/example-task.flux
```