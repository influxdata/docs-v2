---
title: influx auth
description: The `influx auth` command and its subcommands manage authentication tokens in InfluxDB.
menu:
  influxdb_2_0_ref:
    name: influx auth
    parent: influx
weight: 101
influxdb/v2.0/tags: [authentication]
cascade:
  related:
    - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx auth` command and its subcommands manage authentication tokens in InfluxDB.

## Usage
```
influx auth [flags]
influx auth [command]
```

#### Command aliases
`auth`, `authorization`

## Subcommands
| Subcommand                                                    | Description                     |
|:----------                                                    |:-----------                     |
| [active](/influxdb/v2.0/reference/cli/influx/auth/active)     | Activate authentication token   |
| [create](/influxdb/v2.0/reference/cli/influx/auth/create)     | Create authentication token     |
| [delete](/influxdb/v2.0/reference/cli/influx/auth/delete)     | Delete authentication token     |
| [list](/influxdb/v2.0/reference/cli/influx/auth/list)         | List authentication tokens      |
| [inactive](/influxdb/v2.0/reference/cli/influx/auth/inactive) | Inactivate authentication token |

## Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `auth` command |
