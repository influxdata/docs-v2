---
title: influxctl user
description: >
  The `influxctl user` command and its subcommands manage users in InfluxDB
  Cloud Dedicated clusters.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl
weight: 201
---

The `influxctl user` command and its subcommands manage users in
{{< product-name omit="Clustered" >}} clusters.

## Usage

```sh
influxctl user [subcommand] [subcommand options] [arguments...]
```

## Subcommands

| Subcommand                                                               | Description         |
| :----------------------------------------------------------------------- | :------------------ |
| [list](/influxdb3/cloud-dedicated/reference/cli/influxctl/user/list/)     | List all users      |
| help, h                                                                  | Output command help |

<!--
| [delete](/influxdb3/cloud-dedicated/reference/cli/influxctl/user/delete/) | Delete a user       |
| [invite](/influxdb3/cloud-dedicated/reference/cli/influxctl/user/invite/) | Invite a user       |
-->

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
