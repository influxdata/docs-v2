---
title: influx task create
description: The 'influx task create' command creates a new task in InfluxDB.
menu:
  v2_0_ref:
    name: influx task create
    parent: influx task
weight: 201
---

The `influx task create` command creates a new task in InfluxDB.

## Usage
```
influx task create [query literal or @/path/to/query.flux] [flags]
```

## Flags
| Flag           | Description                   | Input type  | {{< cli/mapped >}} |
|:----           |:-----------                   |:----------: |:------------------ |
| `-h`, `--help` | Help for the `create` command |             |                    |
| `--org`        | Organization name             | string      | `INFLUX_ORG`       |
| `--org-id`     | Organiztion ID                | string      | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
