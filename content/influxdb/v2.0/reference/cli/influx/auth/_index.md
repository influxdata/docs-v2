---
title: influx auth
description: The `influx auth` command and its subcommands manage authentication tokens in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth
    parent: influx
weight: 101
influxdb/v2.0/tags: [authentication]
---

The `influx auth` command and its subcommands manage authentication tokens in InfluxDB.

## Usage
```
influx auth [flags]
influx auth [command]
```

#### Aliases
`auth`, `authorization`

## Subcommands
| Subcommand                                                    | Description              |
|:----------                                                    |:-----------              |
| [active](/influxdb/v2.0/reference/cli/influx/auth/active)     | Activate authorization   |
| [create](/influxdb/v2.0/reference/cli/influx/auth/create)     | Create authorization     |
| [delete](/influxdb/v2.0/reference/cli/influx/auth/delete)     | Delete authorization     |
| [list](/influxdb/v2.0/reference/cli/influx/auth/list)         | List authorizations      |
| [inactive](/influxdb/v2.0/reference/cli/influx/auth/inactive) | Inactivate authorization |

## Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `auth` command |
