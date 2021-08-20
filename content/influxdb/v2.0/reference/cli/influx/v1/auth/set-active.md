---
title: influx v1 auth set-active
description: >
  The `influx v1 auth set-active` command activates an authorization in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 auth set-active
    parent: influx v1 auth
weight: 101
influxdb/v2.0/tags: [authorization]
---

The `influx v1 auth set-active` command activates an authorization in the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
Only active authorizations grant access to InfluxDB.

## Usage
```
influx v1 auth set-active [flags]
```

## Flags
| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}      |
|:-----|:------------------|:-------------------------------------------------------------------------|:----------:|:------------------------|
| `-c` | `--active-config` | Config name to use for command                                           | string     | `$INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) | string     | `$INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `set-active` command                                        |            |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                |            | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | ({{< req >}}) HTTP address of InfluxDB                                   | string     | `$INFLUX_HOST`          |
| `-i` | `--id`            | Authorization ID                                                         | string     |                         |
|      | `--json`          | Output data as JSON (default: `false`)                                   |            | `$INFLUX_OUTPUT_JSON`   |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            | `INFLUX_SKIP_VERIFY`    |
| `-t` | `--token`         | API token                                                                | string     | `$INFLUX_TOKEN`         |
|      | `--username`      | Authorization username                                                   | string     | `$INFLUX_USERNAME`      |

## Examples

{{< cli/influx-creds-note >}}

##### Activate a v1 authorization
```sh
influx v1 auth set-active --id 00xX00o0X001
```
