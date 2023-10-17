---
title: influxctl token
description: >
  The `influx token` command and its subcommands manage database tokens in an
  InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl
weight: 201
---

The `influx token` command and its subcommands manage database tokens in an
InfluxDB cluster.

## Usage

```sh
influxctl token [subcommand] [flags]
```

## Subcommands

| Subcommand                                                          | Description                   |
| :------------------------------------------------------------------ | :---------------------------- |
| [create](/influxdb/clustered/reference/cli/influxctl/token/create/) | Create a database token       |
| [delete](/influxdb/clustered/reference/cli/influxctl/token/delete/) | Delete a database token       |
| [get](/influxdb/clustered/reference/cli/influxctl/token/get/)       | Get information about a token |
| [list](/influxdb/clustered/reference/cli/influxctl/token/list/)     | List database tokens          |
| [update](/influxdb/clustered/reference/cli/influxctl/token/update/) | Update a database token       |
| help, h                                                             | Output command help           |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
