---
title: influx org members
description: The `influx org members` command and its subcommands manage organization members in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx org members
    parent: influx org
weight: 201
influxdb/v2.1/tags: [members, organizations]
---

The `influx org members` command and its subcommands manage organization members in InfluxDB.

## Usage
```
influx org members [flags]
influx org members [command]
```

## Subcommands
| Subcommand                                                       | Description                |
|:----------                                                       |:-----------                |
| [add](/influxdb/v2.1/reference/cli/influx/org/members/add)       | Add organization member    |
| [list](/influxdb/v2.1/reference/cli/influx/org/members/list)     | List organization members  |
| [remove](/influxdb/v2.1/reference/cli/influx/org/members/remove) | Remove organization member |

## Flags
| Flag |          | Description                    |
|:---- |:---      |:-----------                    |
| `-h` | `--help` | Help for the `members` command |
