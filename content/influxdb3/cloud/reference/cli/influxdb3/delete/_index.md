---
title: influxdb3 delete
description: >
  The `influxdb3 delete` command deletes a resource such as a database, table,
  or authentication token.
menu:
  influxdb3_cloud:
    parent: influxdb3 CLI
    name: influxdb3 delete
weight: 300
---

The `influxdb3 delete` command deletes a resource such as a database, table, or
authentication token.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                            | Description                                       |
| :-------------------------------------------------------------------- | :------------------------------------------------ |
| [database](/influxdb3/cloud/reference/cli/influxdb3/delete/database/) | Delete a database                                 |
| [table](/influxdb3/cloud/reference/cli/influxdb3/delete/table/)       | Delete a table from a database                    |
| [token](/influxdb3/cloud/reference/cli/influxdb3/delete/token/)       | Delete an authentication token from your instance |
| help                                                                  | Print command help or the help of a subcommand    |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
