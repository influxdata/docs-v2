---
title: influxctl token
description: >
  The `influxctl token` command and its subcommands manage database tokens in an
  InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl
weight: 201
---

The `influxctl token` command and its subcommands manage database tokens in an
InfluxDB Cloud Dedicated cluster.

## Usage

```sh
influxctl token [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                | Description                   |
| :------------------------------------------------------------------------ | :---------------------------- |
| [create](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/) | Create a database token       |
| [delete](/influxdb/cloud-dedicated/reference/cli/influxctl/token/delete/) | Delete a database token       |
| [get](/influxdb/cloud-dedicated/reference/cli/influxctl/token/get/)       | Get information about a token |
| [list](/influxdb/cloud-dedicated/reference/cli/influxctl/token/list/)     | List database tokens          |
| [update](/influxdb/cloud-dedicated/reference/cli/influxctl/token/update/) | Update a database token       |
| help, h                                                                   | Output command help           |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
