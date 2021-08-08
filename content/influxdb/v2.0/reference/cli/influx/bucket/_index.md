---
title: influx bucket
description: The `influx bucket` command and its subcommands manage buckets in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx bucket
    parent: influx
weight: 101
influxdb/v2.0/tags: [buckets]
cascade:
  related:
    - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx bucket` command and its subcommands manage buckets in InfluxDB.

## Usage
```
influx bucket [flags]
influx bucket [command]
```

## Subcommands
| Subcommand                                                  | Description   |
|:----------                                                  |:-----------   |
| [create](/influxdb/v2.0/reference/cli/influx/bucket/create) | Create bucket |
| [delete](/influxdb/v2.0/reference/cli/influx/bucket/delete) | Delete bucket |
| [list](/influxdb/v2.0/reference/cli/influx/bucket/list)     | List buckets  |
| [update](/influxdb/v2.0/reference/cli/influx/bucket/update) | Update bucket |

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                           |:---------- |:------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                      |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `bucket` command                                         |            |                      |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`        |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                      |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                      |
| `-t` | `--token`         | API token                                                  | string     | `INFLUX_TOKEN`       |
