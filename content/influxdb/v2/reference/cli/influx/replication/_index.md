---
title: influx replication
description: Use the `influx` CLI to manage InfluxDB replication streams.
menu:
  influxdb_v2:
    name: influx replication
    parent: influx
weight: 101
influxdb/v2/tags: [write, replication]
cascade:
  related:
    - /influxdb/v2/reference/cli/influx/remote
    - /influxdb/v2/write-data/replication/replicate-data/
---

The `influx replication` command and its subcommands manage InfluxDB Edge Data Replication.

## Usage
```
influx replication [commond options] [arguments...]
```

## Subcommands
| Subcommand                                                       | Description                              |
| :--------------------------------------------------------------- | :--------------------------------------- |
| [create](/influxdb/v2/reference/cli/influx/replication/create) | Create a new replication stream          |
| [delete](/influxdb/v2/reference/cli/influx/replication/delete) | Delete a replication stream              |
| [list](/influxdb/v2/reference/cli/influx/replication/list)     | List all replication streams and metrics |
| [update](/influxdb/v2/reference/cli/influx/replication/update) | Update a replication stream              |

## Flags
| Flag |          | Description                        |
| :--- | :------- | :--------------------------------- |
| `-h` | `--help` | Help for the `replication` command |

