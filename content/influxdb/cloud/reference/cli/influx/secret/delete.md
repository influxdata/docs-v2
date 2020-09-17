---
title: influx secret delete
description: The `influx secret delete` command deletes secrets.
menu:
  influxdb_cloud_ref:
    name: influx secret delete
    parent: influx secret
weight: 101
influxdb/cloud/tags: [secrets]
---

The `influx secret delete` command deletes secrets.

## Usage
```
influx secret delete [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------:|:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `delete` command                                         |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string     | `INFLUX_HOST`         |
|      | `--json`         | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-k` | `--key`          | **(Required)** Secret key                                             | string     |                       |
| `-o` | `--org`          | Organization name                                                     | string     | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`        | Authentication token                                                  | string     | `INFLUX_TOKEN`        |
