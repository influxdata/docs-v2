---
title: influx task – Task management commands
description: The 'influx task' command and its subcommands manage tasks in InfluxDB.
menu:
  v2_0_ref:
    name: influx task
    parent: influx
    weight: 1
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
| [create](/v2.0/reference/cli/influx/task/create) | Create task          |
| [delete](/v2.0/reference/cli/influx/task/delete) | Delete task          |
| [find](/v2.0/reference/cli/influx/task/find)     | Find tasks           |
| [log](/v2.0/reference/cli/influx/task/log)       | Log related commands |
| [retry](/v2.0/reference/cli/influx/task/retry)   | retry a run          |
| [run](/v2.0/reference/cli/influx/task/run)       | Run related commands |
| [update](/v2.0/reference/cli/influx/task/update) | Update task          |

### Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `task` command |

### Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
