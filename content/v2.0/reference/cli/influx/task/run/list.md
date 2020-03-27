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
| Flag             | Description                           | Input type  | {{< cli/mapped >}}    |
|:----             |:-----------                           |:----------: |:------------------    |
| `--after`        | After-time for filtering              | string      |                       |
| `--before`       | Before-time for filtering             | string      |                       |
| `-h`,`--help`    | Help for the `list` command           |             |                       |
| `--hide-headers` | Hide table headers (default `false`)  |             | `INFLUX_HIDE_HEADERS` |
| `--json`         | Output data as JSON (default `false`) |             | `INFLUX_OUTPUT_JSON`  |
| `--limit`        | Limit the number of results           | integer     |                       |
| `--run-id`       | Run ID                                | string      |                       |
| `--task-id`      | **(Required)** Task ID                | string      |                       |

{{% cli/influx-global-flags %}}
