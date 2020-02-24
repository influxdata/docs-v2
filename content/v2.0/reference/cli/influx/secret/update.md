---
title: influx secret update
description: The 'influx secret update' command adds and updates secrets.
menu:
  v2_0_ref:
    name: influx secret update
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret update` command adds and updates secrets.
Provide the secret key with the `-k` or `--key` flag.
When prompted, enter and confirm the secret value.

## Usage
```
influx secret update [flags]
```

## Flags
| Flag           | Description                   | Input type | {{< cli/mapped >}} |
|:----           |:-----------                   |:----------:|:------------------ |
| `-h`, `--help` | Help for the `update` command |            |                    |
| `-k`, `--key`  | **(Required)** Secret key     | string     |                    |
| `-o`, `--org`  | Organization name             | string     | `INFLUX_ORG`       |
| `--org-id`     | Organization ID               | string     | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
