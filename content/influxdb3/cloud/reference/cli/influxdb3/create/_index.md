---
title: influxdb3 create
description: >
  The `influxdb3 create` command creates a resource such as a database, table,
  or authentication token.
menu:
  influxdb3_cloud:
    parent: influxdb3 CLI
    name: influxdb3 create
weight: 300
---

The `influxdb3 create` command creates a resource such as a database, table, or
authentication token.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                            | Description                                    |
| :-------------------------------------------------------------------- | :--------------------------------------------- |
| [database](/influxdb3/cloud/reference/cli/influxdb3/create/database/) | Create a new database                          |
| [table](/influxdb3/cloud/reference/cli/influxdb3/create/table/)       | Create a new table in a database               |
| [token](/influxdb3/cloud/reference/cli/influxdb3/create/token/)       | Create a new authentication token              |
| help                                                                  | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
