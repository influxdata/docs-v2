---
title: influx task create
description: placeholder
menu:
  v2_0_ref:
    name: influx task create
    parent: influx task
    weight: 1
---

Create task

## Usage
```
influx task create [query literal or @/path/to/query.flux] [flags]
```

## Flags
| Flag           | Description                               | Input type  |
|:----           |:-----------                               |:----------: |
| `-h`, `--help` | Help for `create`                         |             |
| `--org`        | Organization name                         | string      |
| `--org-id`     | ID of the organization that owns the task | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
