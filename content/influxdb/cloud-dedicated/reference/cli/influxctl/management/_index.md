---
title: influxctl management
description: >
  The `influxctl management` command and its subcommands manage management
  tokens in an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl
weight: 201
related:
  - /influxdb3/cloud-dedicated/admin/tokens/management/
---

The `influxctl management` command and its subcommands manage management tokens
in an {{< product-name omit=" Clustered" >}} cluster.

Management tokens allow the user to perform administrative tasks on the
InfluxDB instance. This includes creating and deleting databases, managing
users, and other administrative tasks.

Management tokens do not provide access to databases or data in databases.
Only _database tokens_ with "read" or "write" permissions can access data in
databases.

## Usage

```sh
influxctl management [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                     | Description                     |
| :----------------------------------------------------------------------------- | :------------------------------ |
| [create](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/create/) | Create a management token       |
| [list](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/list/)     | List all management tokens      |
| [revoke](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/revoke/) | Revoke a management token by ID |
| help, h                                                                        | Output command help             |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |
