---
title: influx user
description: The `influx user` command and its subcommands manage user information in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx user
    parent: influx
weight: 101
influxdb/cloud/tags: [users]
---

The `influx user` command and its subcommands manage user information in InfluxDB.

## Usage
```
influx user [flags]
influx user [command]
```

## Subcommands
| Subcommand                                           | Description              |
|:----------                                           |:-----------              |
| [create](/influxdb/cloud/reference/cli/influx/user/create)     | Create a user            |
| [delete](/influxdb/cloud/reference/cli/influx/user/delete)     | Delete a user            |
| [list](/influxdb/cloud/reference/cli/influx/user/list)         | List users               |
| [password](/influxdb/cloud/reference/cli/influx/user/password) | Update a user's password |
| [update](/influxdb/cloud/reference/cli/influx/user/update)     | Update a user            |

## Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `user` command |
