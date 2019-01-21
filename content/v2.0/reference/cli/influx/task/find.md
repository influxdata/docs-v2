---
title: influx task find
description: placeholder
menu:
  v2_0_ref:
    name: influx task find
    parent: influx task
    weight: 1
---

Find tasks

## Usage
```
influx task find [flags]
```

## Flags
| Flag              | Description                                 | Input type  |
|:----              |:-----------                                 |:----------: |
| `-h`, `--help`    | Help for `find`                             |             |
| `-i`, `--id`      | Task ID                                     | string      |
| `--limit`         | The number of tasks to find (default `100`) | integer     |
| `--org-id`        | Task organization ID                        | string      |
| `-n`, `--user-id` | Task owner ID                               | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
