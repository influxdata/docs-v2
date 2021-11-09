---
title: influxd recovery user
description: >
  The `influxd recovery user` command and subcommands manage on-disk user 
  data for recovery purposes.
menu:
menu:
  influxdb_2_1_ref:
    parent: influxd recovery
weight: 301
---

The `influxd recovery user` command and subcommands manage on-disk user 
data for recovery purposes.

## Usage
```sh
influxd recovery user [flags]
influxd recovery user [command]
```

## Subcommands
| Subcommand                                                           | Description     |
| :------------------------------------------------------------------- | :-------------- |
| [create](/influxdb/v2.1/reference/cli/influxd/recovery/user/create/) | Create new user |
| [list](/influxdb/v2.1/reference/cli/influxd/recovery/user/list/)     | List users      |

## Flags
| Flag |          | Description     |
| :--- | :------- | :-------------- |
| `-h` | `--help` | Help for `user` |