---
title: influx org find
description: The 'influx org find' lists and searches for organizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx org find
    parent: influx org
weight: 1
---

The `influx org find` lists and searches for organizations in InfluxDB.

## Usage
```
influx org find [flags]
```

## Flags
| Flag           | Description           | Input type  |
|:----           |:-----------           |:----------: |
| `-h`, `--help` | Help for `find`         |             |
| `-i`, `--id`   | The organization ID   | string      |
| `-n`, `--name` | The organization name | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
