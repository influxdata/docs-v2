---
title: influx org
description: The `influx org` command and its subcommands manage organization information in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx org
    parent: influx
weight: 101
influxdb/v2.1/tags: [organizations]
cascade:
  related:
    - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx org` command and its subcommands manage organization information in InfluxDB.

## Usage
```
influx org [flags]
influx org [command]
```

#### Command aliases
`org`, `organization`

## Subcommands
| Subcommand                                                 | Description                      |
|:----------                                                 |:-----------                      |
| [create](/influxdb/v2.1/reference/cli/influx/org/create)   | Create an organization           |
| [delete](/influxdb/v2.1/reference/cli/influx/org/delete)   | Delete an organization           |
| [list](/influxdb/v2.1/reference/cli/influx/org/list)       | List organizations               |
| [members](/influxdb/v2.1/reference/cli/influx/org/members) | Organization membership commands |
| [update](/influxdb/v2.1/reference/cli/influx/org/update)   | Update an organization           |

## Flags
| Flag |          | Description                |
|:---- |:---      |:-----------                |
| `-h` | `--help` | Help for the `org` command |
