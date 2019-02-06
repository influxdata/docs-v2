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

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
