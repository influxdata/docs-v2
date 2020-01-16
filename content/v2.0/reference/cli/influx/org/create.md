---
title: influx org create
description: The 'influx org create' creates a new organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org create
    parent: influx org
weight: 201
---

The `influx org create` creates a new organization in InfluxDB.

## Usage
```
influx org create [flags]
```

## Flags
| Flag                  | Description                         | Input type  |
|:----                  |:-----------                         |:----------: |
| `-d`, `--description` | The description of the organization |             |
| `-h`, `--help`        | Help for `create`                   |             |
| `-n`, `--name`        | The name of organization            | string      |

{{% influx-cli-global-flags %}}
