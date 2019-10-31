---
title: influx org create
description: The 'influx org create' creates a new organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org create
    parent: influx org
weight: 201
---

The `influx org create` creates a new organization in InfluxDB.

## Usage
```
influx org create [flags]
```

## Flags
| Flag           | Description                                   | Input type  |
|:----           |:-----------                                   |:----------: |
| `-h`, `--help` | Help for `create`                             |             |
| `-n`, `--name` | The name of organization that will be created | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands against the local filesystem                  |            |
| `-t`, `--token` | API token to use in client calls                           | string     |
