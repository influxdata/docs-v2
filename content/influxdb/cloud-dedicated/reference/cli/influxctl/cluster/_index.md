---
title: influxctl cluster
description: >
  The `influxctl cluster` command and its subcommands provide information about
  InfluxDB Cloud Dedicated clusters.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl
weight: 201
---

The `influxctl cluster` command and its subcommands provide information about
{{< product-name omit="Clustered" >}} clusters.

## Usage

```sh
influxctl cluster [subcommand] [subcommand options] [arguments...]
```

## Subcommands

| Subcommand                                                              | Description                     |
| :---------------------------------------------------------------------- | :------------------------------ |
| [get](/influxdb3/cloud-dedicated/reference/cli/influxctl/cluster/get/)   | Get information about a cluster |
| [list](/influxdb3/cloud-dedicated/reference/cli/influxctl/cluster/list/) | List all clusters               |
| help, h                                                                 | Output command help             |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
