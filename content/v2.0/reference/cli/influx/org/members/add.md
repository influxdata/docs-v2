---
title: influx org members add
description: The 'influx org members add' command adds a new member to an organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org members add
    parent: influx org members
weight: 301
---

The `influx org members add` command adds a new member to an organization in InfluxDB.

## Usage
```
influx org members add [flags]
```

## Flags
| Flag             | Description           | Input type  |
|:----             |:-----------           |:----------: |
| `-h`, `--help`   | Help for `add`        |             |
| `-i`, `--id`     | The organization ID   | string      |
| `-o`, `--member` | The member ID         | string      |
| `-n`, `--name`   | The organization name | string      |

{{% influx-cli-global-flags %}}
