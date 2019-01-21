---
title: influx task delete
description: placeholder
menu:
  v2_0_ref:
    name: influx task delete
    parent: influx task
    weight: 1
---

Delete task

## Usage
```
influx task delete [flags]
```

## Flags
| Flag           | Description            | Input type  |
|:----           |:-----------            |:----------: |
| `-h`, `--help` | Help for `delete`      |             |
| `-i`, `--id`   | Task id **(Required)** | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
