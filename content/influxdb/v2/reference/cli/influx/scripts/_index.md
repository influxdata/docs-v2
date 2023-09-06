---
title: influx scripts
description: The `influx scripts` command and its subcommands manage invokable scripts in InfluxDB.
menu:
  influxdb_v2_ref:
    name: influx scripts
    parent: influx
weight: 101
influxdb/v2.7/tags: [scripts]
cascade:
  related:
    - /influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
    - /influxdb/cloud/api-guide/api-invokable-scripts/
  metadata: [influx CLI 2.4.0+, InfluxDB Cloud only]
---

The `influx scripts` command and its subcommands manage [invokable scripts](/influxdb/cloud/api-guide/api-invokable-scripts/) in InfluxDB.

### Usage
```
influx scripts [command]
```

### Subcommands
| Subcommand                                                       | Description     |
|:----------                                                       |:-----------     |
| [create](/influxdb/v2/reference/cli/influx/scripts/create)     | Create script   |
| [delete](/influxdb/v2/reference/cli/influx/scripts/delete)     | Delete script   |
| [invoke](/influxdb/v2/reference/cli/influx/scripts/invoke)     | Invoke script   |
| [list](/influxdb/v2/reference/cli/influx/scripts/list)         | List scripts    |
| [retrieve](/influxdb/v2/reference/cli/influx/scripts/retrieve) | Retrieve script |
| [update](/influxdb/v2/reference/cli/influx/scripts/update)     | Update script   |

### Flags
| Flag |          | Description                    |
|:---- |:---      |:-----------                    |
| `-h` | `--help` | Help for the `scripts` command |
