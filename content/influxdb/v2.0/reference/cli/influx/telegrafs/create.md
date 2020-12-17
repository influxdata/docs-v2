---
title: influx telegrafs create
description: >
  The `influx telegrafs create` command creates a new Telegraf configuration in InfluxDB
  using a provided Telegraf configuration file.
menu:
  influxdb_2_0_ref:
    name: influx telegrafs create
    parent: influx telegrafs
weight: 201
---

The `influx telegrafs create` command creates a new Telegraf configuration in InfluxDB
using a provided Telegraf configuration file.

## Usage
```sh
influx telegrafs create [flags]
```

## Flags
| Flag |                   | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---               |:-----------                                                           |:----------: |:------------------    |
| `-c` | `--active-config` | CLI configuration to use for command                                  | string      |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`   | Telegraf configuration description                                    | string      |                       |
| `-f` | `--file`          | Path to Telegraf configuration                                        | string      |                       |
| `-h` | `--help`          | Help for the `create` command                                         |             |                       |
|      | `--hide-headers`  | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
|      | `--json`          | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`          | Telegraf configuration name                                           | string      |                       |
| `-o` | `--org`           | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |

## Examples

{{< cli/influx-creds-note >}}

```sh
# Create a new Telegraf configuration
influx telegrafs create \
  -n "Example configuration name" \
  -d "Example Telegraf configuration description" \
  -f /path/to/telegraf.conf

# Create a new Telegraf configuration with configuration settings
# provided via STDIN
cat /path/to/telegraf.conf | influx telegrafs create \
  -n "Example configuration name" \
  -d "Example Telegraf configuration description" \
```
