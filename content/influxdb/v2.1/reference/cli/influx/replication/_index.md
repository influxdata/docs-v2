---
title: influx replication
description: Manage replication streams
menu:
  influxdb_2_1_ref:
    name: influx replication
    parent: influx
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/remote
---

## Usage
```
influx replication [commond options] [arguments...]
```

## Subcommands
|                                                                  |                                                        |
|:-----------------------------------------------------------------|:-------------------------------------------------------|
| [create](/influxdb/v2.1/reference/cli/influx/replication/create) | Create a new replication stream                        |
| [delete](/influxdb/v2.1/reference/cli/influx/replication/delete) | Delete an existing replication stream                  |
| [list](/influxdb/v2.1/reference/cli/influx/replication/list)     | List all replication streams and corresponding metrics |
| [update](/influxdb/v2.1/reference/cli/influx/replication/update) | Update an existing replication stream                  |

## Flags
| Flag |          | Description                        | Input type | {{< cli/mapped >}} |
|:-----|:---------|:-----------------------------------|:----------:|:-------------------|
| `-h` | `--help` | Help for the `replication` command |            |                    |
