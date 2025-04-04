---
title: influxctl token
description: >
  The `influxctl token` command and its subcommands manage database tokens in an
  InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl
weight: 201
---

The `influxctl token` command and its subcommands manage database tokens in an
{{< product-name omit=" Clustered" >}} cluster.

## Usage

```sh
influxctl token [subcommand] [flags]
```

## Subcommands

| Subcommand                                                           | Description                   |
| :------------------------------------------------------------------- | :---------------------------- |
| [create](/influxdb3/clustered/reference/cli/influxctl/token/create/) | Create a database token       |
| [revoke](/influxdb3/clustered/reference/cli/influxctl/token/revoke/) | Revoke a database token       |
| [get](/influxdb3/clustered/reference/cli/influxctl/token/get/)       | Get information about a token |
| [list](/influxdb3/clustered/reference/cli/influxctl/token/list/)     | List database tokens          |
| [update](/influxdb3/clustered/reference/cli/influxctl/token/update/) | Update a database token       |
| help, h                                                              | Output command help           |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
