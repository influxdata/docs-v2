---
title: influx org delete
description: The `influx org delete` command deletes an organization in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx org delete
    parent: influx org
weight: 201
---

The `influx org delete` command deletes an organization in InfluxDB.

## Usage
```
influx org delete [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `delete` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
| `-i` | `--id`            | ({{< req >}}) Organization ID                                         | string     | `INFLUX_ORG_ID`       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Delete an organization
```sh
influx org delete --id 0Xx0oox00XXoxxoo1
```
