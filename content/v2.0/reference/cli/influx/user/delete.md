---
title: influx user delete
description: The 'influx user delete' command deletes a specified user.
menu:
  v2_0_ref:
    name: influx user delete
    parent: influx user
    weight: 1
---

The `influx user delete` command deletes a specified user in InfluxDB.

## Usage
```
influx user delete [flags]
```

## Flags
| Flag           | Description                | Input type  |
|:----           |:-----------                |:----------: |
| `-h`, `--help` | Help for `delete`          |             |
| `-i`, `--id`   | The user ID **(Required)** | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
