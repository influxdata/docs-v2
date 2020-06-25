---
title: influx auth delete
description: The `influx auth delete` command deletes an authorization in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth delete
    parent: influx auth
weight: 201
---

The `influx auth delete` command deletes an authorization in InfluxDB.

## Usage
```
influx auth delete [flags]
```

## Flags
| Flag |                  | Description                                                | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                |:----------: |:------------------    |
| `-h` | `--help`         | Help for the `delete` command                              |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                       |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`) | string      | `INFLUX_HOST`         |
| `-i` | `--id`           | **(Required)** Authorization ID                            | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                      |             | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`  | Skip TLS certificate verification                          |             |                       |
| `-t` | `--token`        | Authentication token                                       | string      | `INFLUX_TOKEN`        |
