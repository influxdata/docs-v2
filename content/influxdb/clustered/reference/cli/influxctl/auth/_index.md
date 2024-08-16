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
{{< product-name omit="Clustered" >}} clusters.

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
