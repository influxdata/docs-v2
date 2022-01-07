---
title: influx v1 dbrp create
description: >
  The `influx v1 dbrp create` command creates a DBRP mapping in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_1_ref:
    name: influx v1 dbrp create
    parent: influx v1 dbrp
weight: 101
influxdb/v2.1/tags: [DBRP]
---

The `influx v1 dbrp create` command creates a DBRP mapping with the [InfluxDB 1.x compatibility API](/influxdb/v2.1/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp create [flags]
```

## Flags
| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}      |
|:-----|:------------------|:-------------------------------------------------------------------------|:----------:|:------------------------|
| `-c` | `--active-config` | Config name to use for command                                           | string     | `$INFLUX_ACTIVE_CONFIG` |
|      | `--bucket-id`     | Bucket ID to map to                                                      |            |                         |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) | string     | `$INFLUX_CONFIGS_PATH`  |
|      | `--db`            | InfluxDB v1 database to map from                                         |            |                         |
|      | `--default`       | Set DBRP mapping's retention policy as default                           |            |                         |
| `-h` | `--help`          | Help for the `create` command                                            |            |                         |
|      | `--hide-headers`  | Hide table headers (default: `false`)                                    |            | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                 | string     | `$INFLUX_HOST`          |
|      | `--json`          | Output data as JSON (default: `false`)                                   |            | `$INFLUX_OUTPUT_JSON`   |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                   | string     | `$INFLUX_ORG`           |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                        | string     | `$INFLUX_ORG_ID`        |
|      | `--rp`            | InfluxDB v1 retention policy to map from                                 |            |                         |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            | `INFLUX_SKIP_VERIFY`    |
| `-t` | `--token`         | API token                                                                | string     | `$INFLUX_TOKEN`         |


## Examples

{{< cli/influx-creds-note >}}

##### Create a DBRP mapping
```sh
influx v1 dbrp create \
  --bucket-id 12ab34cd56ef \
  --db example-db \
  --rp example-rp \
  --default
```
