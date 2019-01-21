---
title: influx bucket find
description: placeholder
menu:
  v2_0_ref:
    name: influx bucket find
    parent: influx bucket
    weight: 1
---

Find buckets

## Usage
```
influx bucket find [flags]
```

## Flags
| Flag           | Description                  | Input type  |
|:----           |:-----------                  |:----------: |
| `-h`, `--help` | Help for the `find` command  |             |
| `-i`, `--id`   | The bucket ID                | string      |
| `-n`, `--name` | The bucket name              | string      |
| `-o`, `--org`  | The bucket organization name | string      |
| `--org-id`     | The bucket organization ID   | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
