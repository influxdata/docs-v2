---
title: influx task log list
description: The 'influx task log list' command outputs log information related to a task.
menu:
  v2_0_ref:
    name: influx task log list
    parent: influx task log
weight: 301
aliases:
  - /v2.0/reference/cli/influx/task/log/find
---

The `influx task log list` command outputs log information related to a task.

## Usage
```
influx task log list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag           | Description                 | Input type  |
|:----           |:-----------                 |:----------: |
| `-h`, `--help` | Help for the `list` command |             |
| `--run-id`     | Run ID                      | string      |
| `--task-id`    | **(Required)** Task ID      | string      |

{{% cli/influx-global-flags %}}
