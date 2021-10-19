---
title: influx task
description: The `influx task` command and its subcommands manage tasks in InfluxDB.
menu:
  influxdb_2_1_ref:
    name: influx task
    parent: influx
weight: 101
influxdb/v2.1/tags: [tasks]
cascade:
  related:
    - /influxdb/v2.1/process-data/
    - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

The `influx task` command and its subcommands manage tasks in InfluxDB.

### Usage
```
influx task [flags]
influx task [command]
```

### Subcommands
| Subcommand                                                            | Description            |
|:----------                                                            |:-----------            |
| [create](/influxdb/v2.1/reference/cli/influx/task/create)             | Create task            |
| [delete](/influxdb/v2.1/reference/cli/influx/task/delete)             | Delete task            |
| [list](/influxdb/v2.1/reference/cli/influx/task/list)                 | List tasks             |
| [log](/influxdb/v2.1/reference/cli/influx/task/log)                   | Log related commands   |
| [retry-failed](/influxdb/v2.1/reference/cli/influx/task/retry-failed) | Retry failed task runs |
| [run](/influxdb/v2.1/reference/cli/influx/task/run)                   | Run related commands   |
| [update](/influxdb/v2.1/reference/cli/influx/task/update)             | Update task            |

### Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `task` command |
