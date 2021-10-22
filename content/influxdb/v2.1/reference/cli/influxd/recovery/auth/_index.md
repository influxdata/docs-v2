---
title: influxd recovery auth
description: The `influxd recovery auth` command and subcommands ...
menu:
  influxdb_2_1_ref:
    parent: influxd recovery
weight: 301
---

On-disk authorization management commands, for recovery

## Usage
```sh
influxd recovery auth [flags]
influxd recovery auth [command]
```

## Subcommands
| Subcommand                                                                             | Description                          |
| :------------------------------------------------------------------------------------- | :----------------------------------- |
| [create-operator](/influxdb/v2.1/reference/cli/influxd/recovery/auth/create-operator/) | Create new operator token for a user |
| [list](/influxdb/v2.1/reference/cli/influxd/recovery/auth/list/)                       | List authorizations                  |

## Flags
| Flag  |          | Description     |
| :---- | :------- | :-------------- |
| `-h ` | `--help` | Help for `auth` |