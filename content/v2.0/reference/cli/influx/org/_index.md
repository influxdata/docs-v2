---
title: influx org – Organization management commands
description: The 'influx org' command and its subcommands manage organization information in InfluxDB.
menu:
  v2_0_ref:
    name: influx org
    parent: influx
weight: 101
v2.0/tags: [organizations]
---

The `influx org` command and its subcommands manage organization information in InfluxDB.

## Usage
```
influx org [flags]
influx org [command]
```

#### Aliases
`org`, `organization`

## Subcommands
| Subcommand                                        | Description                      |
|:----------                                        |:-----------                      |
| [create](/v2.0/reference/cli/influx/org/create)   | Create an organization           |
| [delete](/v2.0/reference/cli/influx/org/delete)   | Delete an organization           |
| [find](/v2.0/reference/cli/influx/org/find)       | Find organizations               |
| [members](/v2.0/reference/cli/influx/org/members) | Organization membership commands |
| [update](/v2.0/reference/cli/influx/org/update)   | Update an organization           |

## Flags
| Flag           | Description                |
|:----           |:-----------                |
| `-h`, `--help` | Help for the `org` command |

{{% cli/influx-global-flags %}}
