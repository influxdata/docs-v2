---
title: influx org update
description: placeholder
menu:
  v2_0_ref:
    name: influx org update
    parent: influx org
    weight: 1
---

Update organization

## Usage
```
influx org update [flags]
```

## Flags
| Flag           | Description                        | Input type  |
|:----           |:-----------                        |:----------: |
| `-h`, `--help` | Help for `update`                  |             |
| `-i`, `--id`   | The organization ID **(Required)** | string      |
| `-n`, `--name` | The organization name              | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
