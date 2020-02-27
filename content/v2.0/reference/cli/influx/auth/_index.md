---
title: influx auth – Authorization management commands
description: The 'influx auth' command and its subcommands manage authorizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth
    parent: influx
weight: 101
v2.0/tags: [authentication]
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
| [active](/v2.0/reference/cli/influx/auth/active)     | Activate authorization   |
| [create](/v2.0/reference/cli/influx/auth/create)     | Create authorization     |
| [delete](/v2.0/reference/cli/influx/auth/delete)     | Delete authorization     |
| [find](/v2.0/reference/cli/influx/auth/find)         | Find authorization       |
| [inactive](/v2.0/reference/cli/influx/auth/inactive) | Inactivate authorization |

## Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `auth` command |

{{% cli/influx-global-flags %}}
