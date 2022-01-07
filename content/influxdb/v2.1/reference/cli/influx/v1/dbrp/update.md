---
title: influx v1 dbrp update
description: >
  The `influx v1 dbrp update` command updates a DBRP mapping in the InfluxDB 1.x compatibility API.
menu:
  influxdb_2_1_ref:
    name: influx v1 dbrp update
    parent: influx v1 dbrp
weight: 101
influxdb/v2.1/tags: [DBRP]
---

The `influx v1 dbrp update` command updates a DBRP mapping in the [InfluxDB 1.x compatibility API](/influxdb/v2.1/reference/api/influxdb-1x/).

## Usage
```
influx v1 dbrp update [flags]
```

## Flags
| Flag |                   | Description                                                              | Input type | {{< cli/mapped >}}      |
|:-----|:------------------|:-------------------------------------------------------------------------|:----------:|:------------------------|
| `-c` | `--active-config` | Config name to use for command                                           | string     | `$INFLUX_ACTIVE_CONFIG` |
|      | `--configs-path`  | Path to the influx CLI configurations (default: `~/.influxdbv2/configs`) | string     | `$INFLUX_CONFIGS_PATH`  |
|      | `--default`       | Set DBRP mapping's retention policy as default                           |            |                         |
| `-h` | `--help`          | Help for the `update` command                                            |            |                         |
|      | `--hide-headers`  | Hide the table headers (default: `false`)                                |            | `$INFLUX_HIDE_HEADERS`  |
|      | `--host`          | HTTP address of InfluxDB                                                 | string     | `$INFLUX_HOST`          |
|      | `--id`            | ({{< req >}}) DBRP ID                                                    | string     |                         |
|      | `--json`          | Output data as JSON (default: `false`)                                   |            | `$INFLUX_OUTPUT_JSON`   |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                   | string     | `$INFLUX_ORG`           |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                        | string     | `$INFLUX_ORG_ID`        |
| `-r` | `--rp`            | InfluxDB v1 retention policy to map from                                 |            |                         |
|      | `--skip-verify`   | Skip TLS certificate verification                                        |            | `INFLUX_SKIP_VERIFY`    |
| `-t` | `--token`         | API token                                                                | string     | `$INFLUX_TOKEN`         |

## Examples

{{< cli/influx-creds-note >}}

##### Set a DBRP mapping as default
```sh
influx v1 dbrp update \
  --id 12ab34cd56ef78 \
  --default
```

##### Update the retention policy of a DBRP mapping
```sh
influx v1 dbrp update \
  --id 12ab34cd56ef78 \
  --rp new-rp-name
```
