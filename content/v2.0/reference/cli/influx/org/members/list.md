---
title: influx org members list
description: The 'influx org members list' command lists members within an organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org members list
    parent: influx org members
weight: 301
---

The `influx org members list` command lists members within an organization in InfluxDB.

## Usage
```
influx org members list [flags]
```

## Flags
| Flag           | Description           | Input type  |
|:----           |:-----------           |:----------: |
| `-h`, `--help` | Help for `list`       |             |
| `-i`, `--id`   | The organization ID   | string      |
| `-n`, `--name` | The organization name | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
