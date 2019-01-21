---
title: influx user update
description: >
  The 'influx user update' command updates information related to a user such as their user name.
menu:
  v2_0_ref:
    name: influx user update
    parent: influx user
    weight: 1
---

The `influx user update` command updates information related to a user in InfluxDB.

## Usage
```
influx user update [flags]
```

## Flags
| Flag           | Description                | Input type  |
|:----           |:-----------                |:----------: |
| `-h`, `--help` | Help for `update`          |             |
| `-i`, `--id`   | The user ID **(Required)** | string      |
| `-n`, `--name` | The user name              | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
