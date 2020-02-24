---
title: influx user update
description: >
  The 'influx user update' command updates information related to a user such as their user name.
menu:
  v2_0_ref:
    name: influx user update
    parent: influx user
weight: 201
---

The `influx user update` command updates information related to a user in InfluxDB.

## Usage
```
influx user update [flags]
```

## Flags
| Flag           | Description                   | Input type  |
|:----           |:-----------                   |:----------: |
| `-h`, `--help` | Help for the `update` command |             |
| `-i`, `--id`   | **(Required)** User ID        | string      |
| `-n`, `--name` | Username                      | string      |

{{% cli/influx-global-flags %}}
