---
title: influx v1 auth create
description: >
  The `influx v1 auth create` command creates an authorization in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 auth create
    parent: influx v1 auth
weight: 101
influxdb/v2.0/tags: [authorization]
---

The `influx v1 auth create` command creates a legacy authorization with the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 auth create [flags]
```

## Flags
| Flag |                   | Description                                                                                            | Input type  | {{< cli/mapped >}}      |
|:-----|:------------------|:-------------------------------------------------------------------------------------------------------|:-----------:|:------------------------|
| `-c` | `--active-config` | Config name to use for command                                                                         | string      | `$INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`)                               | string      | `$INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`   | Token description                                                                                      | string      |                         |
| `-h` | `--help`          | Help for the `create` command                                                                          |             |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                                              |             | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                                               | string      | `$INFLUX_HOST`          |
|      | `--json`          | Output data as JSON (default: `false`)                                                                 |             | `$INFLUX_OUTPUT_JSON`   |
|      | `--no-password`   | Don't prompt for a password. (You must use the `v1 auth set-password` command before using the token.) |             |                         |
| `-o` | `--org`           | The name of the organization                                                                           | string      | `$INFLUX_ORG`           |
|      | `--org-id`        | The ID of the organization                                                                             | string      | `$INFLUX_ORG_ID`        |
|      | `--read-bucket`   | The bucket ID                                                                                          | stringArray |                         |
|      | `--skip-verify`   | Skip TLS certificate chain and host name verification                                                  |             |                         |
| `-t` | `--token`         | Authentication token                                                                                   | string      | `$INFLUX_TOKEN`         |
|      | `--username`      | (Required) The user name to identify this token                                                        | string      |                         |
|      | `--write-bucket`  | The bucket ID                                                                                          | stringArray |                         |
