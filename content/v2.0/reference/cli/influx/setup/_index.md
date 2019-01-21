---
title: Influx setup command
description: placeholder
menu:
  v2_0_ref:
    name: influx setup
    parent: influx
    weight: 1
---

Create default username, password, org, bucket...

## Usage
```
influx setup [flags]
```

## Flags
| Flag           | Description                  |
|:----           |:-----------                  |
| `-h`, `--help` | Help for the `setup` command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
