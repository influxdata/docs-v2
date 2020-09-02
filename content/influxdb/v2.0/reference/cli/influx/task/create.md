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
influx task create [query literal] [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------:|:--------------------- |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-f` | `--file`         | Path to Flux script file                                              | string     |                       |
| `-h` | `--help`         | Help for the `create` command                                         |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string     | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                                     | string     | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`        | Authentication token                                                  | string     | `INFLUX_TOKEN`        |
