---
title: influx secret
description: The `influx secret` command manages secrets.
menu:
  influxdb_2_0_ref:
    name: influx secret
    parent: influx
weight: 101
influxdb/v2.0/tags: [secrets]
---

The `influx secret` command manages secrets.

## Usage
```
influx secret [flags]
influx secret [subcommand]
```

## Subcommands
| Subcommand                                                   | Description            |
|:----------                                                   |:-----------            |
| [delete](/influxdb/v2.0/reference/cli/influx/secret/delete/) | Delete a secret        |
| [list](/influxdb/v2.0/reference/cli/influx/secret/list/)     | List secrets           |
| [update](/influxdb/v2.0/reference/cli/influx/secret/update/) | Add or update a secret |

## Flags
| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `secret` command |
