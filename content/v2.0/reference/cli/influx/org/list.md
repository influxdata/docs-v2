---
title: influx org list
description: The 'influx org list' lists and searches for organizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx org list
    parent: influx org
weight: 201
aliases:
  - /v2.0/reference/influx/org/find
---

The `influx org list` lists and searches for organizations in InfluxDB.

## Usage
```
influx org list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag           | Description       | Input type  |
|:----           |:-----------       |:----------: |
| `-h`, `--help` | Help for `list`   |             |
| `-i`, `--id`   | Organization ID   | string      |
| `-n`, `--name` | Organization name | string      |

{{% influx-cli-global-flags %}}
