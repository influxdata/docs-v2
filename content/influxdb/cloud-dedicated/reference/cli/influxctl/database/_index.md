---
title: influxctl database
description: >
  The `influx database` command and its subcommands manage databases in an
  InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl
weight: 201
---

The `influx database` command and its subcommands manage databases in an
InfluxDB Cloud Dedicated cluster.

## Usage

```sh
influxctl database [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                   | Description       |
| :--------------------------------------------------------------------------- | :---------------- |
| [create](/influxdb/cloud-dedicated/reference/cli/influxctl/database/create/) | Create a database |
| [list](/influxdb/cloud-dedicated/reference/cli/influxctl/database/list/)     | List databases    |
| [delete](/influxdb/cloud-dedicated/reference/cli/influxctl/database/delete/) | Delete a database |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
