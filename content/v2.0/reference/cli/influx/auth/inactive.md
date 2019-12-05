---
title: influx auth inactive
description: The 'influx auth inactive' inactivates an authorization in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth inactive
    parent: influx auth
weight: 201
---

The `influx auth inactive` inactivates an authorization in InfluxDB.

## Usage
```
influx auth inactive [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-h`, `--help` | Help for the `inactive` command     |             |
| `-i`, `--id`   | The authorization ID **(Required)** | string      |

{{% influx-cli-global-flags %}}
