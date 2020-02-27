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
| Flag           | Description                 | Input type  | {{< cli/mapped >}} |
|:----           |:-----------                 |:----------: |:------------------ |
| `-h`, `--help` | Help for the `find` command |             |                    |
| `-i`, `--id`   | Organization ID             | string      | `INFLUX_ORG`       |
| `-n`, `--name` | Organization name           | string      | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
