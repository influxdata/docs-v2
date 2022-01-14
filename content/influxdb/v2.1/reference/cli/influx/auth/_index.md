---
title: influx auth
description: The `influx auth` command and its subcommands manage API tokens in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx auth
    parent: influx
weight: 101
influxdb/v2.1/tags: [authentication]
cascade:
  related:
    - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
cascade:
  metadata: [influx CLI 2.0.0+, InfluxDB 2.0.0+]
---

The `influx auth` command and its subcommands manage API tokens in InfluxDB.

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
| [active](/influxdb/v2.1/reference/cli/influx/auth/active)     | Activate API token   |
| [create](/influxdb/v2.1/reference/cli/influx/auth/create)     | Create API token     |
| [delete](/influxdb/v2.1/reference/cli/influx/auth/delete)     | Delete API token     |
| [list](/influxdb/v2.1/reference/cli/influx/auth/list)         | List API tokens      |
| [inactive](/influxdb/v2.1/reference/cli/influx/auth/inactive) | Inactivate API token |

## Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `auth` command |
