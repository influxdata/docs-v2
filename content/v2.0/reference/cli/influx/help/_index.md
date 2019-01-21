---
title: Influx help command
description: placeholder
menu:
  v2_0_ref:
    name: influx help
    parent: influx
    weight: 1
---

Help provides help for any command in the application.
Simply type influx help [path to command] for full details.

## Usage
```
influx help [command] [flags]
```

## Flags
| Flag           | Description   |
|:----           |:-----------   |
| `-h`, `--help` | help for help |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
