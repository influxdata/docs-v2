---
title: influx task log find
description: The 'influx task log find' command outputs log information related to a task.
menu:
  v2_0_ref:
    name: influx task log find
    parent: influx task log
weight: 1
---

The `influx task log find` command outputs log information related to a task.

## Usage
```
influx task log find [flags]
```

## Flags
| Flag           | Description            | Input type  |
|:----           |:-----------            |:----------: |
| `-h`, `--help` | Help for `find`        |             |
| `--org-id`     | Organization ID        | string      |
| `--run-id`     | Run ID                 | string      |
| `--task-id`    | Task ID **(Required)** | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
