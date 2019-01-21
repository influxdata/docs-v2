---
title: influx org – Organization management commands
description: The 'influx org' command and its subcommands manage organization information in InfluxDB.
menu:
  v2_0_ref:
    name: influx org
    parent: influx
    weight: 1
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
| [create](/v2.0/reference/cli/influx/org/create)   | Create organization              |
| [delete](/v2.0/reference/cli/influx/org/delete)   | Delete organization              |
| [find](/v2.0/reference/cli/influx/org/find)       | Find organizations               |
| [members](/v2.0/reference/cli/influx/org/members) | Organization membership commands |
| [update](/v2.0/reference/cli/influx/org/update)   | Update organization              |

## Flags
| Flag           | Description                |
|:----           |:-----------                |
| `-h`, `--help` | Help for the `org` command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
