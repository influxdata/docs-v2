---
title: influx setup – Run the initial Influx DB setup
description: >
  The 'influx setup' command walks through the initial InfluxDB setup process,
  creating a default user, organization, and bucket.
menu:
  v2_0_ref:
    name: influx setup
    parent: influx
weight: 101
---

The `influx setup` command walks through the initial InfluxDB setup process,
creating a default user, organization, and bucket.

## Usage
```
influx setup [flags]
```

## Flags
| Flag           | Description                  |
|:----           |:-----------                  |
| `-h`, `--help` | Help for the `setup` command |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
