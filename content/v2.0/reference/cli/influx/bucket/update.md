---
title: influx bucket update
description: placeholder
menu:
  v2_0_ref:
    name: influx bucket update
    parent: influx bucket
    weight: 1
---

Update bucket

## Usage
```
influx bucket update [flags]
```

## Flags
| Flag                | Description                           | Input type  |
|:----                |:-----------                           |:----------: |
| `-h`, `--help`      | Help for the `update` command         |             |
| `-i`, `--id`        | The bucket ID **(Required)**          | string      |
| `-n`, `--name`      | New bucket name                       | string      |
| `-r`, `--retention` | New duration data will live in bucket | duration    |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
