---
title: influx org update
description: The 'influx org update' command updates information related to organizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx org update
    parent: influx org
weight: 201
---

The `influx org update` command updates information related to organizations in InfluxDB.

## Usage
```
influx org update [flags]
```

## Flags
| Flag           | Description                        | Input type  |
|:----           |:-----------                        |:----------: |
| `-h`, `--help` | Help for `update`                  |             |
| `-i`, `--id`   | The organization ID **(Required)** | string      |
| `-n`, `--name` | The organization name              | string      |

{{% influx-cli-global-flags %}}
