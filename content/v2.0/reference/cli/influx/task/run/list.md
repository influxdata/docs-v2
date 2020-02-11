---
title: influx task run list
description: The 'influx task run list' command outputs information related to runs of a task.
menu:
  v2_0_ref:
    name: influx task run list
    parent: influx task run
weight: 301
aliases:
  - /v2.0/reference/cli/influx/task/run/find
---

The `influx task run list` command outputs information related to runs of a task.

## Usage
```
influx task run list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag          | Description                 | Input type  |
|:----          |:-----------                 |:----------: |
| `--after`     | After-time for filtering    | string      |
| `--before`    | Before-time for filtering   | string      |
| `-h`,`--help` | Help for `list`             |             |
| `--limit`     | Limit the number of results | integer     |
| `--org-id`    | Organization ID             | string      |
| `--run-id`    | Run ID                      | string      |
| `--task-id`   | Task ID **(Required)**      | string      |

{{% influx-cli-global-flags %}}
