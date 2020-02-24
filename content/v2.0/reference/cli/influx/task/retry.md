---
title: influx task retry
description: The 'influx task retry' command retries to run a task in InfluxDB.
menu:
  v2_0_ref:
    name: influx task retry
    parent: influx task
weight: 201
---

The `influx task retry` command retries to run a task in InfluxDB.

## Usage
```
influx task retry [flags]
```

## Flags
| Flag              | Description                  | Input type  |
|:----              |:-----------                  |:----------: |
| `-h`, `--help`    | Help for the `retry` command |             |
| `-r`, `--run-id`  | Run ID **(Required)**        | string      |
| `-i`, `--task-id` | Task ID **(Required)**       | string      |

{{% cli/influx-global-flags %}}
