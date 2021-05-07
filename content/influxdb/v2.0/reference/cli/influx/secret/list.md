---
title: influx secret list
description: The `influx secret list` command lists secret keys.
menu:
  influxdb_2_0_ref:
    name: influx secret list
    parent: influx secret
weight: 101
influxdb/v2.0/tags: [secrets]
---

The `influx secret list` command lists secret keys.

## Usage
```
influx secret list [flags]
```

#### Command aliases
`list`, `ls`, `find`

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------:|:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string     |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string     |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`          | Help for the `list` command                                           |            |                       |
|      | `--hide-headers`  | Hide table headers (default `false`)                                  |            | `INFLUX_HIDE_HEADERS` |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            | string     | `INFLUX_HOST`         |
|      | `--json`          | Output data as JSON (default `false`)                                 |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                | string     | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     | string     | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  | string     | `INFLUX_TOKEN`        |

## Examples

{{< cli/influx-creds-note >}}

##### List all secret keys
```sh
influx secret list
```