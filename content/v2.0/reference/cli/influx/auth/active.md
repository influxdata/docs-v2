---
title: influx auth active
description: The 'influx auth active' command activates an authorization.
menu:
  v2_0_ref:
    name: influx auth active
    parent: influx auth
weight: 201
---

The `influx auth active` command activates an authorization in InfluxDB.

## Usage
```
influx auth active [flags]
```

## Flags
| Flag           | Description                         | Input type |
|:----           |:-----------                         |:----------:|
| `-h`, `--help` | Help for the `active` command       |            |
| `-i`, `--id`   | The authorization ID **(Required)** | string     |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands against the local filesystem                  |            |
| `-t`, `--token` | API token to use in client calls                           | string     |
