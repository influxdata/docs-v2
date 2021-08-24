---
title: influx auth list
description: The `influx auth list` command lists API tokens in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth list
    parent: influx auth
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/auth/find
---

The `influx auth list` command lists and searches API tokens in InfluxDB.

## Usage
```
influx auth list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:-----|:------------------|:----------------------------------------------------------------------|:----------:|:----------------------|
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          | string     |                       |
| `-i` | `--id`            | API token ID                                                          | string     |                       |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     |                       |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     |                       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            | `INFLUX_SKIP_VERIFY`  |
| `-t` | `--token`         | API token                                                             | string     | `INFLUX_TOKEN`        |
| `-u` | `--user`          | Username                                                              | string     |                       |
|      | `--user-id`       | User ID                                                               | string     |                       |

## Examples

{{< cli/influx-creds-note >}}

##### List all API tokens
```sh
influx auth list
```

##### List API tokens associated with a user
```sh
influx auth list --user username
```
