---
title: influx bucket create
description: The 'influx bucket create' command creates a new bucket in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket create
    parent: influx bucket
    weight: 1
---

The `influx bucket create` command creates a new bucket in InfluxDB.

## Usage
```
influx bucket create [flags]
```

## Flags
| Flag                | Description                                      | Input type  |
|:----                |:-----------                                      |:----------: |
| `-h`, `--help`      | Help for the `create` command                    |             |
| `-n`, `--name`      | Name of bucket that will be created              | string      |
| `-o`, `--org`       | Name of the organization that owns the bucket    | string      |
| `--org-id`          | The ID of the organization that owns the bucket  | string      |
| `-r`, `--retention` | Duration in nanoseconds data will live in bucket | duration    |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
