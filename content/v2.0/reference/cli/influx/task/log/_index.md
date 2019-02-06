---
title: influx task log
description: The 'influx task log' and its subcommand 'find' output log information related related to a task.
menu:
  v2_0_ref:
    name: influx task log
    parent: influx task
weight: 201
---

The `influx task log` command and its subcommand `find` output log information related to a task.

## Usage
```
influx task log [flags]
influx task log [command]
```

## Subcommands
| Subcommand                                       | Description        |
|:----------                                       |:-----------        |
| [find](/v2.0/reference/cli/influx/task/log/find) | Find logs for task |

## Flags
| Flag           | Description    |
|:----           |:-----------    |
| `-h`, `--help` | Help for `log` |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
