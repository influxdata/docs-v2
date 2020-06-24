---
title: influx task run
description: >
  The 'influx task run' command and its subcommand 'list' output information
  related to runs of a task.
menu:
  v2_0_ref:
    name: influx task run
    parent: influx task
weight: 201
---

The `influx task run` command and its subcommand `list` output information related to runs of a task.

## Usage
```
influx task run [flags]
influx task run [command]
```

## Subcommands
| Subcommand                                         | Description          |
|:----------                                         |:-----------          |
| [list](/v2.0/reference/cli/influx/task/run/list)   | List runs for a task |
| [retry](/v2.0/reference/cli/influx/task/run/retry) | Retry a task         |

## Flags
| Flag |          | Description                |
|:---- |:---      |:-----------                |
| `-h` | `--help` | Help for the `run` command |
