---
title: influx task – Task management commands
description: The 'influx task' command and its subcommands manage tasks in InfluxDB.
menu:
  v2_0_ref:
    name: influx task
    parent: influx
weight: 101
v2.0/tags: [tasks]
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
| [list](/v2.0/reference/cli/influx/task/list)     | List tasks           |
| [log](/v2.0/reference/cli/influx/task/log)       | Log related commands |
| [retry](/v2.0/reference/cli/influx/task/retry)   | retry a run          |
| [run](/v2.0/reference/cli/influx/task/run)       | Run related commands |
| [update](/v2.0/reference/cli/influx/task/update) | Update task          |

### Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `task` command |

{{% influx-cli-global-flags %}}
