---
title: influx telegrafs rm
description: >
  The `influx telegrafs rm` command removes Telegraf configurations from InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx telegrafs rm
    parent: influx telegrafs
weight: 201
---

The `influx telegrafs rm` command removes Telegraf configurations from InfluxDB.

## Usage
```sh
influx telegrafs rm [flags]
```

#### Command aliases
`rm`, `remove`

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}     |
|:---- |:---               |:-----------                                                           |:----------: |:------------------     |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                        |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`   |
| `-h` | `--help`          | Help for the `rm` command                                             |             |                        |
|      | `--hide-headers`  | Hide the table headers                                                |             | `$INFLUX_HIDE_HEADERS` |
| `-i` | `--id`            | Telegraf configuration ID to remove                                   | stringArray |                        |
|      | `--json`          | Output data as json                                                   |             | `$INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |             |                        |
| `-t` | `--token`         | API token                                                  | string      | `INFLUX_TOKEN`         |

## Examples

{{< cli/influx-creds-note >}}

##### Remove a Telegraf configuration
```sh
influx telegrafs rm --id ab12cd34ef56
```

##### Remove multiple Telegraf configurations
```sh
influx telegrafs rm \
  --i 0Xx0oox00XXoxxoo1 \
  --i oox0Xx0ox00XXxoo2
```
