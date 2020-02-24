---
title: influx task update
description: The 'influx task update' command updates information related to tasks in InfluxDB.
menu:
  v2_0_ref:
    name: influx task update
    parent: influx task
weight: 201
---

The `influx task update` command updates information related to tasks in InfluxDB.

## Usage
```
influx task update [flags]
```

## Flags
| Flag           | Description            | Input type  |
|:----           |:-----------            |:----------: |
| `-h`, `--help` | Help for `update`      |             |
| `-i`, `--id`   | Task ID **(Required)** | string      |
| `--status`     | Update task status     | string      |

{{% cli/influx-global-flags %}}
