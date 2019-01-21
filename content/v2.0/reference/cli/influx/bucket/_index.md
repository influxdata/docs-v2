---
title: Influx bucket management commands
description: placeholder
menu:
  v2_0_ref:
    name: influx bucket
    parent: influx
    weight: 1
---

Bucket management commands

## Usage
```
influx bucket [flags]
influx bucket [command]
```

## Subcommands
| Subcommand | Description   |
|:---------- |:-----------   |
| create     | Create bucket |
| delete     | Delete bucket |
| find       | Find buckets  |
| update     | Update bucket |

## Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the bucket command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
