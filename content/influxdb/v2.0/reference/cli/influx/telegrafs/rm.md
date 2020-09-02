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

#### Aliases
`rm`, `remove`

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}     |
|:---- |:---              |:-----------                                                           |:----------: |:------------------     |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`   |
| `-h` | `--help`         | Help for the `rm` command                                             |             |                        |
|      | `--hide-headers` | Hide the table headers                                                |             | `$INFLUX_HIDE_HEADERS` |
| `-i` | `--id`           | Telegraf configuration ID to remove                                   | strings     |                        |
|      | `--json`         | Output data as json                                                   |             | `$INFLUX_OUTPUT_JSON`  |

## Examples
```sh
# Remove a single Telegraf configuration
influx telegrafs rm -i $ID

# Remove multiple Telegraf configurations
influx telegrafs rm -i $ID1 -i $ID2
```
