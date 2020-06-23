---
title: influx org list
description: The `influx org list` lists and searches for organizations in InfluxDB.
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
| Flag |                  | Description                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                           |:----------: |:------------------    |
| `-h` | `--help`         | Help for the `list` command           |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)  |             | `INFLUX_HIDE_HEADERS` |
| `-i` | `--id`           | Organization ID                       | string      | `INFLUX_ORG`          |
|      | `--json`         | Output data as JSON (default `false`) |             | `INFLUX_OUTPUT_JSON`  |
| `-n` | `--name`         | Organization name                     | string      | `INFLUX_ORG_ID`       |

{{% cli/influx-global-flags %}}
