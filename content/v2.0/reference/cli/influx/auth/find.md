---
title: influx auth find
description: The 'influx auth find' command lists and searches authorizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth find
    parent: influx auth
    weight: 1
---

The `influx auth find` command lists and searches authorizations in InfluxDB.

## Usage
```
influx auth find [flags]
```

## Flags
| Flag           | Description                 | Input type  |
|:----           |:-----------                 |:----------: |
| `-h`, `--help` | Help for the `find` command |             |
| `-i`, `--id`   | The authorization ID        | string      |
| `-u`, `--user` | The user                    | string      |
| `--user-id`    | The user ID                 | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
