---
title: influx org members - Organization membership management commands
description: The 'influx org members' command and its subcommands manage organization members in InfluxDB.
menu:
  v2_0_ref:
    name: influx org members
    parent: influx org
weight: 201
v2.0/tags: [members, organizations]
---

The `influx org members` command and its subcommands manage organization members in InfluxDB.

## Usage
```
influx org members [flags]
influx org members [command]
```

## Subcommands
| Subcommand                                              | Description                |
|:----------                                              |:-----------                |
| [add](/v2.0/reference/cli/influx/org/members/add)       | Add organization member    |
| [list](/v2.0/reference/cli/influx/org/members/list)     | List organization members  |
| [remove](/v2.0/reference/cli/influx/org/members/remove) | Remove organization member |

## Flags
| Flag           | Description                    |
|:----           |:-----------                    |
| `-h`, `--help` | Help for the `members` command |

{{% cli/influx-global-flags %}}
