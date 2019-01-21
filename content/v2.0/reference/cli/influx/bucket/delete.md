---
title: influx bucket delete
description: placeholder
menu:
  v2_0_ref:
    name: influx bucket delete
    parent: influx bucket
    weight: 1
---

Delete bucket

## Usage
```
influx bucket delete [flags]
```

## Flags
| Flag           | Description                   | Input type  |
|:----           |:-----------                   |:----------: |
| `-h`, `--help` | Help for the `delete` command |             |
| `-i`, `--id`   | The bucket ID **(Required)**  | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
