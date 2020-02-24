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
| Flag              | Description                                 | Input type  | {{< cli/mapped >}} |
|:----              |:-----------                                 |:----------: |:------------------ |
| `-h`, `--help`    | Help for `find`                             |             |                    |
| `-i`, `--id`      | Task ID                                     | string      |                    |
| `--limit`         | The number of tasks to find (default `100`) | integer     |                    |
| `--org`           | Task organization name                      | string      | `INFLUX_ORG`       |
| `--org-id`        | Task organization ID                        | string      | `INFLUX_ORG_ID`    |
| `-n`, `--user-id` | Task owner ID                               | string      |                    |

{{% cli/influx-global-flags %}}
