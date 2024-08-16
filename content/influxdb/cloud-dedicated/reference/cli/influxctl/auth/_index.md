---
title: influxctl auth
description: >
  The `influxctl auth` command and its subcommands provide the ability to
  login and logout.
menu:
  influxdb_cloud_dedicated:
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
| [login](/influxdb/cloud-dedicated/reference/cli/influxctl/auth/login/)   | Log in to an InfluxDB cluster using InfluxData Auth0 |
| [logout](/influxdb/cloud-dedicated/reference/cli/influxctl/auth/logout/) | Log out of an InfluxDB cluster; remove local authorization tokens |
| help, h                                                                  | Output command help             |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
