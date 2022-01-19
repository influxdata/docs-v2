---
title: influx remote
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote
    parent: influx
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
  - /influxdb/v2.1/write-data/replication
---

Use the `influx remote` command to manage connections to remote instances of InfluxDB.
Remote connections are used to replicate data at the bucket level.

## Usage
```
influx remote [commond options] [arguments...]
```

## Subcommands

|                                                               |                                      |
|:--------------------------------------------------------------|--------------------------------------|
| [`create`](/influxdb/v2.1/reference/cli/influx/remote/create) | Create a new remote connection       |
| [`delete`](/influxdb/v2.1/reference/cli/influx/remote/delete) | Delete an existing remote connection |
| [`list`](/influxdb/v2.1/reference/cli/influx/remote/list)     | List all remote connections          |
| [`update`](/influxdb/v2.1/reference/cli/influx/remote/update) | Update an existing remote connection |

## Flags
| Flag |          | Description                   | Input type | {{< cli/mapped >}} |
|:-----|:---------|:------------------------------|:----------:|:-------------------|
| `-h` | `--help` | Help for the `remote` command |            |                    |
