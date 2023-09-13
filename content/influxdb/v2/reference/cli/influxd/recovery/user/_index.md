---
title: influxd recovery user
description: >
  The `influxd recovery user` command and subcommands manage on-disk user 
  data for recovery purposes.
menu:
menu:
  influxdb_v2_ref:
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
| Subcommand                                                           | Description       |
| :------------------------------------------------------------------- | :---------------- |
| [create](/influxdb/v2/reference/cli/influxd/recovery/user/create/) | Create new user   |
| [list](/influxdb/v2/reference/cli/influxd/recovery/user/list/)     | List users        |
| [update](/influxdb/v2/reference/cli/influxd/recovery/user/list/)   | Update a password |

## Flags
| Flag |          | Description     |
| :--- | :------- | :-------------- |
| `-h` | `--help` | Help for `user` |