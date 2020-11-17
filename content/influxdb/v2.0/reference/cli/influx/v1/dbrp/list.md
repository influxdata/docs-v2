---
title: influx v1 dbrp list
description: >
  The `influx v1 dbrp list` command lists and searches DBRP mappings in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_0_ref:
    name: influx v1 dbrp list
    parent: influx v1 dbrp
weight: 101
influxdb/v2.0/tags: [dbrp]
---

The `influx v1 dbrp list` command lists and searches DBRP mappings in the [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags

| Flag |                   | Description                                                                                | Input type | {{< cli/mapped >}}      |
|------|-------------------|--------------------------------------------------------------------------------------------|------------|-------------------------|
| `-c` | `--active-config` | Config name to use for command                                                             | string     | `$INFLUX_ACTIVE_CONFIG` |
| `-b` | `--bucket-id`     | Bucket ID                                                                                  |            |                         |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`)                   | string     | `$INFLUX_CONFIGS_PATH`  |
| `-d` | `--db`            | InfluxDB v1 database to map from                                                                    |            |                         |
|      | `--default`       | Specify if this mapping represents the default retention policy for the database specified |            |                         |
| `-h` | `--help`          | Help for the `list` command                                                              |            |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                                  |            | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                                   | string     | `$INFLUX_HOST`          |
|      | `--json`          | Output data as JSON (default: `false`)                                                     |            | `$INFLUX_OUTPUT_JSON`   |
| `-o` | `--org`           | Organization name                                                        | string     | `$INFLUX_ORG`           |
|      | `--org-id`        | Organization ID                                                          | string     | `$INFLUX_ORG_ID`        |
| `-r` | `--rp`            | InfluxDB v1 retention policy                                                         | string     | `$INFLUX_ORG`           |
|      | `--skip-verify`   | Skip TLS certificate verification                                                          |            |                         |
| `-t` | `--token`         | Authentication token                                                                       | string     | `$INFLUX_TOKEN`         |
