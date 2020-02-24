---
title: influx org members remove
description: The 'influx org members remove' command removes a member from an organization in InfluxDB.
menu:
  v2_0_ref:
    name: influx org members remove
    parent: influx org members
weight: 301
---

The `influx org members remove` command removes a member from an organization in InfluxDB.

## Usage
```
influx org members remove [flags]
```

## Flags
| Flag             | Description           | Input type  | {{< cli/mapped >}} |
|:----             |:-----------           |:----------: |:------------------ |
| `-h`, `--help`   | Help for `remove`     |             |                    |
| `-i`, `--id`     | The organization ID   | string      | `INFLUX_ORG_ID`    |
| `-o`, `--member` | The member ID         | string      |                    |
| `-n`, `--name`   | The organization name | string      | `INFLUX_ORG`       |

{{% cli/influx-global-flags %}}
