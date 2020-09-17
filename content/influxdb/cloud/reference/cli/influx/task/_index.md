---
title: influx task
description: The `influx task` command and its subcommands manage tasks in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx task
    parent: influx
weight: 101
influxdb/cloud/tags: [tasks]
---

The `influx task` command and its subcommands manage tasks in InfluxDB.

### Usage
```
influx task [flags]
influx task [command]
```

### Subcommands
| Subcommand                                       | Description          |
|:----------                                       |:-----------          |
| [create](/influxdb/cloud/reference/cli/influx/task/create) | Create task          |
| [delete](/influxdb/cloud/reference/cli/influx/task/delete) | Delete task          |
| [list](/influxdb/cloud/reference/cli/influx/task/list)     | List tasks           |
| [log](/influxdb/cloud/reference/cli/influx/task/log)       | Log related commands |
| [run](/influxdb/cloud/reference/cli/influx/task/run)       | Run related commands |
| [update](/influxdb/cloud/reference/cli/influx/task/update) | Update task          |

### Flags
| Flag |          | Description                 |
|:---- |:---      |:-----------                 |
| `-h` | `--help` | Help for the `task` command |
