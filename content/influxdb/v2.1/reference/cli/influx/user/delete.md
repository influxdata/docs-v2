---
title: influx user delete
description: The `influx user delete` command deletes a specified user.
menu:
  influxdb_2_1_ref:
    name: influx user delete
    parent: influx user
weight: 201
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/delete/
---

The `influx user delete` command deletes a specified user in InfluxDB.

## Usage
```
influx user delete [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `delete` command                                         |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
| `-i` | `--id`            | ({{< req >}}) User ID                                                 | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### Delete a user
```sh
influx user delete --id 0Xx0oox00XXoxxoo1
```
