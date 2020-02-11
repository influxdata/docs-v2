---
title: influx task list
description: The 'influx task list' command lists and searches for tasks in InfluxDB.
menu:
  v2_0_ref:
    name: influx task list
    parent: influx task
weight: 201
aliases:
  - /v2.0/reference/cli/influx/task/find
---

The `influx task list` command lists and searches for tasks in InfluxDB.

## Usage
```
influx task list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag              | Description                                 | Input type  |
|:----              |:-----------                                 |:----------: |
| `-h`, `--help`    | Help for `list`                             |             |
| `-i`, `--id`      | Task ID                                     | string      |
| `--limit`         | The number of tasks to list (default `100`) | integer     |
| `--org`           | Task organization name                      | string      |
| `--org-id`        | Task organization ID                        | string      |
| `-n`, `--user-id` | Task owner ID                               | string      |

{{% influx-cli-global-flags %}}
