---
title: influx org
description: The `influx org` command and its subcommands manage organization information in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx org
    parent: influx
weight: 101
influxdb/cloud/tags: [organizations]
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
| [create](/influxdb/cloud/reference/cli/influx/org/create)   | Create an organization           |
| [delete](/influxdb/cloud/reference/cli/influx/org/delete)   | Delete an organization           |
| [list](/influxdb/cloud/reference/cli/influx/org/list)       | List organizations               |
| [members](/influxdb/cloud/reference/cli/influx/org/members) | Organization membership commands |
| [update](/influxdb/cloud/reference/cli/influx/org/update)   | Update an organization           |

## Flags
| Flag |          | Description                |
|:---- |:---      |:-----------                |
| `-h` | `--help` | Help for the `org` command |
