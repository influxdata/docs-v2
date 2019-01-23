---
title: influx org members add
description: The 'influx org members add' command adds a new member to an organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org members add
    parent: influx org members
    weight: 1
---

The `influx org members add` command adds a new member to an organization in InfluxDB.

## Usage
```
influx org members add [flags]
```

## Flags
| Flag             | Description           | Input type  |
|:----             |:-----------           |:----------: |
| `-h`, `--help`   | Help for `add`        |             |
| `-i`, `--id`     | The organization ID   | string      |
| `-o`, `--member` | The member ID         | string      |
| `-n`, `--name`   | The organization name | string      |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
