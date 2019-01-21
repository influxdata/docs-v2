---
title: influx org create
description: placeholder
menu:
  v2_0_ref:
    name: influx org create
    parent: influx org
    weight: 1
---

Create organization

## Usage
```
influx org create [flags]
```

## Flags
| Flag           | Description                                   | Input type  |
|:----           |:-----------                                   |:----------: |
| `-h`, `--help` | Help for `create`                             |             |
| `-n`, `--name` | The name of organization that will be created | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
