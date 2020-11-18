---
title: influx v1 dbrp delete
description: >
  The `influx v1 dbrp delete` command deletes a DBRP mapping in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 dbrp delete
    parent: influx v1 dbrp
weight: 101
influxdb/v2.0/tags: [DBRP]
---

The `influx v1 dbrp delete` command deletes a DBRP mapping in the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp delete [flags]
```

## Flags
| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}      |
|------|-------------------|--------------------------------------------------------------------------|------------|-------------------------|
| `-c` | `--active-config` | Config name to use for command                                           | string     | `$INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) | string     | `$INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `delete` command                                            |            |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                |            | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                 | string     | `$INFLUX_HOST`          |
| `-i` | `--id`            | DBRP ID (required)                                                       | string     |                         |
|      | `--json`          | Output data as JSON (default: `false`)                                   |            | `$INFLUX_OUTPUT_JSON`   |
| `-o` | `--org`           | Organization name                                                        | string     | `$INFLUX_ORG`           |
|      | `--org-id`        | Organization ID                                                          | string     | `$INFLUX_ORG_ID`        |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            |                         |
| `-t` | `--token`         | Authentication token                                                     | string     | `$INFLUX_TOKEN`         |
