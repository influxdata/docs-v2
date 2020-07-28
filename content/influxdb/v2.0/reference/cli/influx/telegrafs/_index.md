---
title: influx telegrafs
description: >
  The `influx telegrafs` command lists Telegraf configurations.
  Subcommands manage Telegraf configurations.
menu:
  v2_0_ref:
    name: influx telegrafs
    parent: influx
weight: 101
aliases:
  - /v2.0/reference/cli/influx/telegrafs/
v2.0/tags: [telegraf]
---

The `influx telegrafs` command lists Telegraf configurations.
Subcommands manage Telegraf configurations.

## Usage
```sh
influx telegrafs [flags]
influx telegrafs [command]
```

## Subcommands
| Subcommand                                            | Description                     |
|:----------                                            |:-----------                     |
| [create](/v2.0/reference/cli/influx/telegrafs/create) | Create a Telegraf configuration |
| [rm](/v2.0/reference/cli/influx/telegrafs/rm)         | Remove a Telegraf configuration |
| [update](/v2.0/reference/cli/influx/telegrafs/update) | Update a Telegraf configuration |

## Flags
| Flag |                  | Description                                                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                                                           |:----------: |:------------------    |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string      |`INFLUX_CONFIGS_PATH`  |
| `-h` | `--help`         | Help for the `telegrafs` command                                      |             |                       |
|      | `--hide-headers` | Hide table headers                                                    |             | `INFLUX_HIDE_HEADERS` |
| `-i` | `--id`           | Telegraf configuration ID to retrieve                                 | string      |                       |
|      | `--json`         | Output data as JSON                                                   |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                                                     | string      | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                                                       | string      | `INFLUX_ORG_ID`       |

## Examples
```sh
# List all known Telegraf configurations
influx telegrafs

# List only a Telegraf configuration with the specified ID
influx telegrafs -i $ID
```
