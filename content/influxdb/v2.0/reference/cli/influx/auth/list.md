---
title: influx auth list
description: The `influx auth list` command lists and searches authorizations in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth list
    parent: influx auth
weight: 201
aliases:
  - /v2.0/reference/cli/influx/auth/find
  - /v2.0/reference/cli/influx/auth/list/
---

The `influx auth list` command lists and searches authorizations in InfluxDB.

## Usage
```
influx auth list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `list` command                                           |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `INFLUX_HOST`         |
| `-i` | `--id`           | Authorization ID                                                      | string      |                       |
|      | `--json`         | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                                     | string      |                       |
|      | `--org-id`       | Organization ID                                                       | string      |                       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
| `-u` | `--user`         | Username                                                              | string      |                       |
|      | `--user-id`      | User ID                                                               | string      |                       |
