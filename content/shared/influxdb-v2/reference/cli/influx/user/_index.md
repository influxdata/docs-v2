---
title: influx user
description: The `influx user` command and its subcommands manage user information in InfluxDB.
menu:
  influxdb_v2:
    name: influx user
    parent: influx
weight: 101
influxdb/v2/tags: [users]
cascade:
  related:
    - /influxdb/v2/admin/users/
    - /influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
  metadata: [influx CLI 2.0.0+, InfluxDB 2.0.0+]
canonical: /influxdb/v2/reference/cli/influx/user/
---

The `influx user` command and its subcommands manage user information in InfluxDB.

## Usage
```
influx user [flags]
influx user [command]
```

## Subcommands
| Subcommand                                                    | Description              |
|:----------                                                    |:-----------              |
| [create](/influxdb/v2/reference/cli/influx/user/create)     | Create a user            |
| [delete](/influxdb/v2/reference/cli/influx/user/delete)     | Delete a user            |
| [list](/influxdb/v2/reference/cli/influx/user/list)         | List users               |
| [password](/influxdb/v2/reference/cli/influx/user/password) | Update a user's password |
| [update](/influxdb/v2/reference/cli/influx/user/update)     | Update a user            |

## Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `user` command |
