---
title: influx auth inactive
description: placeholder
menu:
  v2_0_ref:
    name: influx auth inactive
    parent: influx auth
    weight: 1
---

Inactive authorization

## Usage
```
influx auth inactive [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-h`, `--help` | Help for the `inactive` command     |             |
| `-i`, `--id`   | The authorization ID **(Required)** | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
