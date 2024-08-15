---
title: influxctl auth
description: >
  The `influxctl auth` command and its subcommands provide the ability to
  login and logout.
menu:
  influxdb_clustered:
    parent: influxctl
weight: 201
---

The `influxctl auth` command and its subcommands provide information about
{{< product-name >}} clusters.

## Usage

```sh
influxctl auth [subcommand] [subcommand options] [arguments...]
```

## Subcommands

| Subcommand                                                               | Description                     |
| :----------------------------------------------------------------------- | :------------------------------ |
| [login](/influxdb/cloud-dedicated/reference/cli/influxctl/auth/login/)   | Log in using InfluxData Auth0 or an InfluxDB Clustered identity provider |
| [logout](/influxdb/cloud-dedicated/reference/cli/influxctl/auth/logout/) | Remove local authorization tokens to log out of an InfluxDB cluster            |
| help, h                                                                  | Output command help             |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
