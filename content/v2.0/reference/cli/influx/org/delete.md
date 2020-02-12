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
| Flag           | Description                    | Input type  |
|:----           |:-----------                    |:----------: |
| `-h`, `--help` | Help for `delete`              |             |
| `-i`, `--id`   | **(Required)** Organization ID | string      |

{{% influx-cli-global-flags %}}
