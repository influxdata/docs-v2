---
title: influx task run find
description: The 'influx task run find' command outputs information related to runs of a task.
menu:
  v2_0_ref:
    name: influx task run find
    parent: influx task run
weight: 301
---

The `influx task run find` command outputs information related to runs of a task.

## Usage
```
influx task run find [flags]
```

## Flags
| Flag          | Description                 | Input type  |
|:----          |:-----------                 |:----------: |
| `--after`     | After-time for filtering    | string      |
| `--before`    | Before-time for filtering   | string      |
| `-h`,`--help` | Help for `find`             |             |
| `--limit`     | Limit the number of results | integer     |
| `--org-id`    | Organization ID             | string      |
| `--run-id`    | Run ID                      | string      |
| `--task-id`   | Task ID **(Required)**      | string      |

{{% influx-cli-global-flags %}}
