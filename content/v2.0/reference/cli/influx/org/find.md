---
title: influx org find
description: The 'influx org find' lists and searches for organizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx org find
    parent: influx org
weight: 201
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

{{% influx-cli-global-flags %}}
