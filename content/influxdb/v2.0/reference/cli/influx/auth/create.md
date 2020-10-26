---
title: influx auth create
description: The `influx auth create` creates an authorization in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth create
    parent: influx auth
weight: 201
---

The `influx auth create` creates an authorization in InfluxDB.

## Usage
```
influx auth create [flags]
```

## Flags
| Flag |                      | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:-----|:---------------------|:----------------------------------------------------------------------|:-----------:|:----------------------|
| `-c` | `--active-config`    | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`     | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`             | Help for the `create` command                                         |             |                       |
|      | `--hide-headers`     | Hide table headers (default `false`)                                  |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`             | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `INFLUX_HOST`         |
|      | `--json`             | Output data as JSON (default `false`)                                 |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`              | **(Required)** Organization name                                      | string      | `INFLUX_ORG`          |
|      | `--org-id`           | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |
|      | `--read-bucket`      | Grants permission to read specified bucket IDs                        | stringArray |                       |
|      | `--read-buckets`     | Grants permission to read **all** organization buckets                |             |                       |
|      | `--read-dashboards`  | Grants permission to read dashboards                                  |             |                       |
|      | `--read-orgs`        | Grants permission to read organizations                               |             |                       |
|      | `--read-tasks`       | Grants permission to read tasks                                       |             |                       |
|      | `--read-telegrafs`   | Grants permission to read Telegraf configurations                     |             |                       |
|      | `--read-user`        | Grants permission to read organization users                          |             |                       |
|      | `--skip-verify`      | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`            | Authentication token                                                  | string      | `INFLUX_TOKEN`        |
| `-u` | `--user`             | Username                                                              | string      |                       |
|      | `--write-bucket`     | Grants permission to write to specified bucket IDs                    | stringArray |                       |
|      | `--write-buckets`    | Grants permission to create and update **all** organization buckets   |             |                       |
|      | `--write-dashboards` | Grants permission to create and update dashboards                     |             |                       |
|      | `--write-orgs`       | Grants permission to create and update organizations                  |             |                       |
|      | `--write-tasks`      | Grants permission to create and update tasks                          |             |                       |
|      | `--write-telegrafs`  | Grants permission to create and update Telegraf configurations        |             |                       |
|      | `--write-user`       | Grants permission to create and update organization users             |             |                       |
