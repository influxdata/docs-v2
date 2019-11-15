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
| Flag              | Description            | Input type  |
|:----              |:-----------            |:----------: |
| `-h`, `--help`    | Help for `retry`       |             |
| `-r`, `--run-id`  | Run id **(Required)**  | string      |
| `-i`, `--task-id` | Task id **(Required)** | string      |

{{% influx-cli-global-flags %}}
