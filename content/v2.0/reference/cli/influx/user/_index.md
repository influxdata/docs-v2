---
title: influx user – User management commands
description: The 'influx user' command and its subcommands manage user information in InfluxDB.
menu:
  v2_0_ref:
    name: influx user
    parent: influx
weight: 101
v2.0/tags: [users]
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
| [create](/v2.0/reference/cli/influx/user/create)     | Create a user            |
| [delete](/v2.0/reference/cli/influx/user/delete)     | Delete a user            |
| [list](/v2.0/reference/cli/influx/user/list)         | List users               |
| [password](/v2.0/reference/cli/influx/user/password) | Update a user's password |
| [update](/v2.0/reference/cli/influx/user/update)     | Update a user            |

## Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `user` command |

{{% cli/influx-global-flags %}}
