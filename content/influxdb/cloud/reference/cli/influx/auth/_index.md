---
title: influx auth
description: The `influx auth` command and its subcommands manage authorizations in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx auth
    parent: influx
weight: 101
influxdb/cloud/tags: [authentication]
---

The `influx auth` command and its subcommands manage authorizations in InfluxDB.

## Usage
```
influx auth [flags]
influx auth [command]
```

#### Aliases
`auth`, `authorization`

## Subcommands
| Subcommand                                           | Description              |
|:----------                                           |:-----------              |
| [active](/influxdb/cloud/reference/cli/influx/auth/active)     | Activate authorization   |
| [create](/influxdb/cloud/reference/cli/influx/auth/create)     | Create authorization     |
| [delete](/influxdb/cloud/reference/cli/influx/auth/delete)     | Delete authorization     |
| [list](/influxdb/cloud/reference/cli/influx/auth/list)         | List authorizations      |
| [inactive](/influxdb/cloud/reference/cli/influx/auth/inactive) | Inactivate authorization |

## Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `auth` command |
