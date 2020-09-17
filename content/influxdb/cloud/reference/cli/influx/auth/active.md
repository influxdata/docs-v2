---
title: influx auth active
description: The `influx auth active` command activates an authorization.
menu:
  influxdb_cloud_ref:
    name: influx auth active
    parent: influx auth
weight: 201
---

The `influx auth active` command activates an authorization in InfluxDB.

## Usage
```
influx auth active [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------:|:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `active` command                                         |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string     | `INFLUX_HOST`         |
| `-i` | `--id`           | **(Required)** Authorization ID                                       | string     |                       |
|      | `--json`         | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`        | Authentication token                                                  | string     | `INFLUX_TOKEN`        |
