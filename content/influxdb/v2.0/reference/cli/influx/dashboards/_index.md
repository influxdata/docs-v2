---
title: influx dashboards
description: >
  The `influx dashboards` command lists existing InfluxDB dashboards.
menu:
  influxdb_2_0_ref:
    name: influx dashboards
    parent: influx
weight: 101
influxdb/v2.0/tags: [telegraf]
related:
  - /influxdb/v2.0/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
---

The `influx dashboards` command lists existing InfluxDB dashboards.

## Usage
```sh
influx dashboards [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `dashboards` command                                     |             |                       |
|      | `--hide-headers`  | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string      | `$INFLUX_HOST`        |
| `-i` | `--id`            | Dashboard ID to retrieve                                              | stringArray |                       |
|      | `--json`          | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                       |
| `-t` | `--token`         | Authentication token                                                  | string      | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### List all dashboards
```sh
influx dashboards
```

##### List only specific dashboards
```sh
influx dashboards \
  --id 068ad4a493f2d000 \
  --id 0623f2dabc000121
```
