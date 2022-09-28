---
title: influx v1 dbrp list
description: >
  The `influx v1 dbrp list` command lists and searches DBRP mappings in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_1_ref:
    name: influx v1 dbrp list
    parent: influx v1 dbrp
weight: 101
influxdb/v2.1/tags: [dbrp]
---

The `influx v1 dbrp list` command lists and searches DBRP mappings in the [InfluxDB 1.x compatibility API](/influxdb/v2.1/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp list [flags]
```

## Flags

| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}      |
|------|-------------------|--------------------------------------------------------------------------|------------|-------------------------|
| `-c` | `--active-config` | Config name to use for command                                           | string     | `$INFLUX_ACTIVE_CONFIG` |
|      | `--bucket-id`     | Bucket ID                                                                |            |                         |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) | string     | `$INFLUX_CONFIGS_PATH`  |
|      | `--db`            | Filter DBRP mappings by database                                         |            |                         |
|      | `--default`       | Limit results to default mapping                                         |            |                         |
| `-h` | `--help`          | Help for the `list` command                                              |            |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                |            | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                 | string     | `$INFLUX_HOST`          |
|      | `--id`            | Limit results to a specified mapping                                     | string     |                         |
|      | `--json`          | Output data as JSON (default: `false`)                                   |            | `$INFLUX_OUTPUT_JSON`   |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                   | string     | `$INFLUX_ORG`           |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                        | string     | `$INFLUX_ORG_ID`        |
|      | `--rp`            | Filter DBRP mappings by InfluxDB v1 retention policy                     | string     | `$INFLUX_ORG`           |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            | `INFLUX_SKIP_VERIFY`    |
| `-t` | `--token`         | API token                                                                | string     | `$INFLUX_TOKEN`         |

## Examples

{{< cli/influx-creds-note >}}

##### List all DBRP mappings in your organization
```sh
influx v1 dbrp list
```

##### List DBRP mappings for specific buckets
```sh
influx v1 dbrp list \
  --bucket-id 12ab34cd56ef78 \
  --bucket-id 09zy87xw65vu43
```

##### List DBRP mappings with a specific database
```sh
influx v1 dbrp list --db example-db
```

##### List DBRP mappings with a specific retention policy
```sh
influx v1 dbrp list --rp example-rp
```
