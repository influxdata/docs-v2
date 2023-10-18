---
title: influxd recovery auth
description: >
  The `influxd recovery auth` command and subcommands manage on-disk authorization 
  data for recovery purposes.
menu:
  influxdb_v2_ref:
    parent: influxd recovery
weight: 301
---

The `influxd recovery auth` command and subcommands manage on-disk authorization 
data for recovery purposes.

## Usage
```sh
influxd recovery auth [flags]
influxd recovery auth [command]
```

## Subcommands
| Subcommand                                                                             | Description                          |
| :------------------------------------------------------------------------------------- | :----------------------------------- |
| [create-operator](/influxdb/v2/reference/cli/influxd/recovery/auth/create-operator/) | Create new operator token for a user |
| [list](/influxdb/v2/reference/cli/influxd/recovery/auth/list/)                       | List authorizations                  |

## Flags
| Flag  |          | Description     |
| :---- | :------- | :-------------- |
| `-h ` | `--help` | Help for `auth` |