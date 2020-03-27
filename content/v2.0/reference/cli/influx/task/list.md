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
| Flag              | Description                             | Input type  | {{< cli/mapped >}}    |
|:----              |:-----------                             |:----------: |:------------------    |
| `-h`, `--help`    | Help for the `list` command             |             |                       |
| `--hide-headers`  | Hide table headers (default `false`)    |             | `INFLUX_HIDE_HEADERS` |
| `-i`, `--id`      | Task ID                                 | string      |                       |
| `--json`          | Output data as JSON (default `false`)   |             | `INFLUX_OUTPUT_JSON`  |
| `--limit`         | Number of tasks to find (default `100`) | integer     |                       |
| `--org`           | Task organization name                  | string      | `INFLUX_ORG`          |
| `--org-id`        | Task organization ID                    | string      | `INFLUX_ORG_ID`       |
| `-n`, `--user-id` | Task owner ID                           | string      |                       |

{{% cli/influx-global-flags %}}
