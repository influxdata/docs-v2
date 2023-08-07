---
title: influxctl database
description: >
  The `influx database` command and its subcommands manage databases in an
  InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl
weight: 201
---

The `influx database` command and its subcommands manage databases in an
InfluxDB cluster.

## Usage

```sh
influxctl database [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                   | Description       |
| :--------------------------------------------------------------------------- | :---------------- |
| [create](/influxdb/clustered/reference/cli/influxctl/database/create/) | Create a database |
| [list](/influxdb/clustered/reference/cli/influxctl/database/list/)     | List databases    |
| [delete](/influxdb/clustered/reference/cli/influxctl/database/delete/) | Delete a database |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
