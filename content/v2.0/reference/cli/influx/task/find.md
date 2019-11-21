---
title: influx task find
description: The 'influx task find' command lists and searches for tasks in InfluxDB.
menu:
  v2_0_ref:
    name: influx task find
    parent: influx task
weight: 201
---

The `influx task find` command lists and searches for tasks in InfluxDB.

## Usage
```
influx task find [flags]
```

## Flags
| Flag              | Description                                 | Input type  |
|:----              |:-----------                                 |:----------: |
| `-h`, `--help`    | Help for `find`                             |             |
| `-i`, `--id`      | Task ID                                     | string      |
| `--limit`         | The number of tasks to find (default `100`) | integer     |
| `--org`           | Task organization name                      | string      |
| `--org-id`        | Task organization ID                        | string      |
| `-n`, `--user-id` | Task owner ID                               | string      |

{{% influx-cli-global-flags %}}
