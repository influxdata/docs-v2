---
title: influx task delete
description: The 'influx task delete' command deletes a task in InfluxDB.
menu:
  v2_0_ref:
    name: influx task delete
    parent: influx task
weight: 201
---

The `influx task delete` command deletes a task in InfluxDB.

## Usage
```
influx task delete [flags]
```

## Flags
| Flag           | Description                   | Input type  |
|:----           |:-----------                   |:----------: |
| `-h`, `--help` | Help for the `delete` command |             |
| `-i`, `--id`   | **(Required)** Task ID        | string      |

{{% cli/influx-global-flags %}}
