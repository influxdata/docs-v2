---
title: influx auth active
description: The 'influx auth active' command activates an authorization.
menu:
  v2_0_ref:
    name: influx auth active
    parent: influx auth
weight: 201
---

The `influx auth active` command activates an authorization in InfluxDB.

## Usage
```
influx auth active [flags]
```

## Flags
| Flag           | Description                         | Input type |
|:----           |:-----------                         |:----------:|
| `-h`, `--help` | Help for the `active` command       |            |
| `-i`, `--id`   | The authorization ID **(Required)** | string     |

{{% cli/influx-global-flags %}}
