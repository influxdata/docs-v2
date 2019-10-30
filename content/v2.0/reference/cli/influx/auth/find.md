---
title: influx auth find
description: The 'influx auth find' command lists and searches authorizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth find
    parent: influx auth
weight: 201
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
| `-o`, `--org`  | The organization            | string      |
| `--org-id`     | The organization ID         | string      |
| `-u`, `--user` | The user                    | string      |
| `--user-id`    | The user ID                 | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands against the local filesystem                  |            |
| `-t`, `--token` | API token to use in client calls                           | string     |
