---
title: influx v1 dbrp create
description: >
  The `influx v1 dbrp create` command creates a DBRP mapping in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 dbrp create
    parent: influx v1 dbrp
weight: 101
influxdb/v2.0/tags: [DBRP]
---

The `influx v1 dbrp create` command creates a DBRP mapping with the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp create [flags]
```

## Flags
| Flag  |                   | Description                                                                                | Input type | {{< cli/mapped >}}      |
|-------|-------------------|--------------------------------------------------------------------------------------------|------------|-------------------------|
| `-c`  | `--active-config` | Config name to use for command                                                             | string     | `$INFLUX_ACTIVE_CONFIG` |
| `-b`  | `--bucket-id`     | Bucket ID                                                                                  |            |                         |
|       | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`)                   | string     | `$INFLUX_CONFIGS_PATH`  |
| `-d`  | `--db`            | V1 database to map from                                                                    |            |                         |
|       | `--default`       | Sets DBRP as the default   |            |                         |
| `-h`  | `--help`          | Help for the `create` command                                                              |            |                         |
|       | `--hide-headers`  | Hide the table headers (default: `false`)                                                  |            | `$INFLUX_HIDE_HEADERS`  |
|       | `--host`          | HTTP address of InfluxDB                                                                   | string     | `$INFLUX_HOST`          |
|       | `--json`          | Output data as JSON (default: `false`)                                                     |            | `$INFLUX_OUTPUT_JSON`   |
| `-o`  | `--org`           | Organization name                                                                          | string     | `$INFLUX_ORG`           |
|       | `--org-id`        | Organization ID                                                                            | string     | `$INFLUX_ORG_ID`        |
|       | `--read-bucket`   | Bucket ID to assign read permissions to                                                    |            |                         |
| `-r`  | `--rp`            | InfluxDB v1 retention policy                                                               |            |                         |
| `-t`  | `--token`         | Authentication token                                                                       | string     | `$INFLUX_TOKEN`         |
