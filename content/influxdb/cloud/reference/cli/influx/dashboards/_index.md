---
title: influx dashboards
description: >
  The `influx dashboards` command lists existing InfluxDB dashboards.
menu:
  influxdb_cloud_ref:
    name: influx dashboards
    parent: influx
weight: 101
influxdb/cloud/tags: [telegraf]
---

The `influx dashboards` command lists existing InfluxDB dashboards.

## Usage
```sh
influx dashboards [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `dashboards` command                                     |             |                       |
|      | `--hide-headers` | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)            | string      | `$INFLUX_HOST`        |
| `-i` | `--id`           | Dashboard ID to retrieve                                              | string      |                       |
|      | `--json`         | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`  | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`        | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples
```sh
# List all dashboards
influx dashboards

# List all dashboards matching IDs
influx dashboards -i $ID1 -i $ID2
```
