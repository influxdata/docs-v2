---
title: influx org members remove
description: placeholder
menu:
  v2_0_ref:
    name: influx org members remove
    parent: influx org members
    weight: 1
---

Remove organization member

## Usage
```
influx org members remove [flags]
```

## Flags
| Flag             | Description           | Input type  |
|:----             |:-----------           |:----------: |
| `-h`, `--help`   | Help for `remove`     |             |
| `-i`, `--id`     | The organization ID   | string      |
| `-o`, `--member` | The member ID         | string      |
| `-n`, `--name`   | The organization name | string      |

## Global Flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
