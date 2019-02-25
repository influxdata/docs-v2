---
title: influx help – Help command for the influx CLI
description: The 'influx help' command provides help for any command in the `influx` command line interface.
menu:
  v2_0_ref:
    name: influx help
    parent: influx
weight: 101
---

The `influx help` command provides help for any command in the `influx` command line interface.

## Usage
```
influx help [command] [flags]
```

## Flags
| Flag           | Description   |
|:----           |:-----------   |
| `-h`, `--help` | Help for help |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
