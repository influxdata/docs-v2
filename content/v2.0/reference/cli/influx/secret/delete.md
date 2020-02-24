---
title: influx secret delete
description: The 'influx secret delete' command deletes secrets.
menu:
  v2_0_ref:
    name: influx secret delete
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret delete` command deletes secrets.

## Usage
```
influx secret delete [flags]
```

## Flags
| Flag           | Description                   | Input type | {{< cli/mapped >}} |
|:----           |:-----------                   |:----------:|:------------------ |
| `-h`, `--help` | Help for the `delete` command |            |                    |
| `-k`, `--key`  | **(Required)** Secret key     | string     |                    |
| `-o`, `--org`  | Organization name             | string     | `INFLUX_ORG`       |
| `--org-id`     | Organization ID               | string     | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
