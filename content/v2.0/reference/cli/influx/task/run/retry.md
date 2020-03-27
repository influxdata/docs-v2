---
title: influx task run retry
description: The 'influx task run retry' command retries to run a task in InfluxDB.
menu:
  v2_0_ref:
    name: influx task run retry
    parent: influx task run
weight: 301
---

The `influx task run retry` command retries to run a task in InfluxDB.

## Usage
```
influx task run retry [flags]
```

## Flags
| Flag              | Description                  | Input type  |
|:----              |:-----------                  |:----------: |
| `-h`, `--help`    | Help for the `retry` command |             |
| `-r`, `--run-id`  | **(Required)** Run ID        | string      |
| `-i`, `--task-id` | **(Required)** Task ID       | string      |

{{% cli/influx-global-flags %}}
