---
title: influx task retry
description: placeholder
menu:
  v2_0_ref:
    name: influx task retry
    parent: influx task
    weight: 1
---

retry a run

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

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
