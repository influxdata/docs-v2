---
title: influx org delete
description: placeholder
menu:
  v2_0_ref:
    name: influx org delete
    parent: influx org
    weight: 1
---

Delete organization

## Usage
```
  influx org delete [flags]
```

## Flags
| Flag           | Description                        | Input type  |
|:----           |:-----------                        |:----------: |
| `-h`, `--help` | Help for `delete`                  |             |
| `-i`, `--id`   | The organization ID **(Required)** | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
