---
title: influx org members
description: The `influx org members` command and its subcommands manage organization members in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx org members
    parent: influx org
weight: 201
influxdb/cloud/tags: [members, organizations]
---

The `influx org members` command and its subcommands manage organization members in InfluxDB.

## Usage
```
influx org members [flags]
influx org members [command]
```

## Subcommands
| Subcommand                                              | Description                |
|:----------                                              |:-----------                |
| [add](/influxdb/cloud/reference/cli/influx/org/members/add)       | Add organization member    |
| [list](/influxdb/cloud/reference/cli/influx/org/members/list)     | List organization members  |
| [remove](/influxdb/cloud/reference/cli/influx/org/members/remove) | Remove organization member |

## Flags
| Flag |          | Description                    |
|:---- |:---      |:-----------                    |
| `-h` | `--help` | Help for the `members` command |
