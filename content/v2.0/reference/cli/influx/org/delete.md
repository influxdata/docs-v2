---
title: influx org delete
description: The 'influx org delete' command deletes an organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org delete
    parent: influx org
weight: 201
---

The `influx org delete` command deletes an organization in InfluxDB.

## Usage
```
influx org delete [flags]
```

## Flags
| Flag           | Description                    | Input type  | {{< cli/mapped >}} |
|:----           |:-----------                    |:----------: |:------------------ |
| `-h`, `--help` | Help for the `delete` command  |             |                    |
| `-i`, `--id`   | Organization ID **(Required)** | string      | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
