---
title: influx telegrafs update
description: >
  The `influx telegrafs update` command updates a Telegraf configuration to match the specified parameters.
  If a name or description are not provided, they are set to an empty string.
menu:
  influxdb_2_0_ref:
    name: influx telegrafs update
    parent: influx telegrafs
weight: 201
---

The `influx telegrafs update` command updates a Telegraf configuration to match the specified parameters.
If a name or description are not provided, they are set to an empty string.

## Usage
```sh
influx telegrafs update [flags]
```

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-d` | `--description`  | Telegraf configuration description                                    | string      |                       |
| `-f` | `--file`         | Path to Telegraf configuration                                        | string      |                       |
| `-h` | `--help`         | Help for the `update` command                                         |             |                       |
|      | `--hide-headers` | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | Telegraf configuration name                                           | string      |                       |
| `-o` | `--org`          | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |

## Examples
```sh
# Update a Telegraf configuration
influx telegrafs update \
  -i $ID \
  -n "Example configuration name" \
  -d "Example Telegraf configuration description" \
  -f /path/to/telegraf.conf

# Update a Telegraf configuration with configuration settings
# provided via STDIN
cat /path/to/telegraf.conf | influx telegrafs update \
  -i $ID \
  -n "Example configuration name" \
  -d "Example Telegraf configuration description" \
```
