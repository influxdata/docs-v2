---
title: Influx user management commands
description: placeholder
menu:
  v2_0_ref:
    name: influx user
    parent: influx
    weight: 1
---

User management commands

## Usage
```
influx user [flags]
influx user [command]
```

## Subcommands
| Subcommand | Description |
|:---------- |:----------- |
| create     | Create user |
| delete     | Delete user |
| find       | Find user   |
| update     | Update user |

## Flags
| Flag           | Description                 |
|:----           |:-----------                 |
| `-h`, `--help` | Help for the `user` command |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
