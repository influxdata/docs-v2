---
title: influxctl token
description: >
  The `influx token` command and its subcommands manage database tokens in an
  InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl
weight: 201
---

The `influx token` command and its subcommands manage database tokens in an
InfluxDB Cloud Dedicated cluster.

## Usage

```sh
influxctl token [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                | Description             |
| :------------------------------------------------------------------------ | :---------------------- |
| [create](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/) | Create a database token |
| [list](/influxdb/cloud-dedicated/reference/cli/influxctl/token/list/)     | List database tokens    |
| [delete](/influxdb/cloud-dedicated/reference/cli/influxctl/token/delete/) | Delete a database token |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
