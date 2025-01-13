---
title: influxctl database
description: >
  The `influxctl database` command and its subcommands manage databases in an
  InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl
weight: 201
---

The `influxctl database` command and its subcommands manage databases in an
InfluxDB cluster.

## Usage

```sh
influxctl database [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                   | Description         |
| :--------------------------------------------------------------------------- | :------------------ |
| [create](/influxdb3/clustered/reference/cli/influxctl/database/create/) | Create a database   |
| [delete](/influxdb3/clustered/reference/cli/influxctl/database/delete/) | Delete a database   |
| [list](/influxdb3/clustered/reference/cli/influxctl/database/list/)     | List databases      |
| [update](/influxdb3/clustered/reference/cli/influxctl/database/update/)   | Update a database   |
| help, h                                                                      | Output command help |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
