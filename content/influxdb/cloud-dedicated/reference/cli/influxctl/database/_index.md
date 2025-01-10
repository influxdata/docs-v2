---
title: influxctl database
description: >
  The `influxctl database` command and its subcommands manage databases in an
  InfluxDB Cloud Dedicated cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl
weight: 201
---

The `influxctl database` command and its subcommands manage databases in an
InfluxDB Cloud Dedicated cluster.

## Usage

```sh
influxctl database [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                   | Description         |
| :--------------------------------------------------------------------------- | :------------------ |
| [create](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/create/) | Create a database   |
| [delete](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/delete/) | Delete a database   |
| [list](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/list/)     | List databases      |
| [update](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/update/) | Update a database   |
| help, h                                                                      | Output command help |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
