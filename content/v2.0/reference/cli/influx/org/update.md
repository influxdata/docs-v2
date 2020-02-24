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
| Flag                  | Description                      | Input type | {{< cli/mapped >}}       |
|:----                  |:-----------                      |:----------:|:------------------       |
| `-d`, `--description` | Description for the organization | string     | `INFLUX_ORG_DESCRIPTION` |
| `-h`, `--help`        | Help for the `update` command    |            |                          |
| `-i`, `--id`          | **(Required)** Organization ID   | string     | `INFLUX_ORG_ID`          |
| `-n`, `--name`        | Organization name                | string     | `INFLUX_ORG`             |

{{% cli/influx-global-flags %}}
