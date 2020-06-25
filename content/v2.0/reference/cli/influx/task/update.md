---
title: influx task update
description: The `influx task update` command updates information related to tasks in InfluxDB.
menu:
  v2_0_ref:
    name: influx task update
    parent: influx task
weight: 201
---

The `influx task update` command updates information related to tasks in InfluxDB.

## Usage
```
influx task update [flags]
```

## Flags
| Flag |                  | Description                                                | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                |:----------: |:------------------    |
| `-f` | `--file`         | Path to Flux script file                                   | string      |                       |
| `-h` | `--help`         | Help for the `update` command                              |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                       |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`         |
| `-i` | `--id`           | **(Required)** Task ID                                     | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                      |             | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`  | Skip TLS certificate verification                          |             |                       |
|      | `--status`       | Update task status                                         | string      |                       |
| `-t` | `--token`        | Authentication token                                       | string      | `INFLUX_TOKEN`        |
