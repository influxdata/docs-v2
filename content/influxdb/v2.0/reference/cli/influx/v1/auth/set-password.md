---
title: influx v1 auth set-password
description: >
  The `influx v1 auth set-password` command sets a password for an existing authorization in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 auth set-password
    parent: influx v1 auth
weight: 101
influxdb/v2.0/tags: [authorization]
---

The `influx v1 auth set-password` command sets a password for an existing authorization in the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 auth set-password [flags]
```

## Flags
| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}      |
|:-----|:------------------|:-------------------------------------------------------------------------|:----------:|:------------------------|
| `-c` | `--active-config` | Config name to use for command                                           | string     | `$INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) | string     | `$INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `set-password` command                                      |            |                         |
|      | `--host`          | HTTP address of InfluxDB                                                 | string     | `$INFLUX_HOST`          |
| `-i` | `--id`            | Authorization ID                                                         | string     |                         |
|      | `--password`      | Password to set on the authorization                                     | string     |                         |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            |                         |
| `-t` | `--token`         | Authentication token                                                     | string     | `$INFLUX_TOKEN`         |
|      | `--username`      | Authorization username                                                   | string     | `$INFLUX_USERNAME`      |
