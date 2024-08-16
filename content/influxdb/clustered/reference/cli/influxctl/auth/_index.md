---
title: influxctl auth
description: >
  The `influxctl auth` command and its subcommands let a user
  log in to and log out of an InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl
weight: 201
---

The `influxctl auth` command and its subcommands let a user log in to and log out of an {{< product-name omit="Clustered" >}} cluster.

## Usage

```sh
influxctl auth [subcommand] [subcommand options] [arguments...]
```

## Subcommands

| Subcommand                                                         | Description                     |
| :----------------------------------------------------------------- | :------------------------------ |
| [login](/influxdb/clustered/reference/cli/influxctl/auth/login/)   | Log in to an InfluxDB cluster using the cluster's identity provider |
| [logout](/influxdb/clustered/reference/cli/influxctl/auth/logout/) | Remove local tokens             |
| help, h                                                            | Output command help             |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
