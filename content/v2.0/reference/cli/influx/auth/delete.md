---
title: influx auth delete
description: placeholder
menu:
  v2_0_ref:
    name: influx auth delete
    parent: influx auth
    weight: 1
---

Delete authorization

## Usage
```
influx auth delete [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-h`, `--help` | Help for the `delete` command       |             |
| `-i`, `--id`   | The authorization ID **(Required)** | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
