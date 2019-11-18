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
| Subcommand                                       | Description |
|:----------                                       |:----------- |
| [create](/v2.0/reference/cli/influx/user/create) | Create user |
| [delete](/v2.0/reference/cli/influx/user/delete) | Delete user |
| [find](/v2.0/reference/cli/influx/user/find)     | Find user   |
| [update](/v2.0/reference/cli/influx/user/update) | Update user |

## Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `user` command |

{{% influx-cli-global-flags %}}
