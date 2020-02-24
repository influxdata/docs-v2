---
title: influx secret find
description: The 'influx secret find' command lists secret keys.
menu:
  v2_0_ref:
    name: influx secret find
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret find` command lists secret keys.

## Usage
```
influx secret find [flags]
```

## Flags
| Flag           | Description            | Input type | {{< cli/mapped >}} |
|:----           |:-----------            |:----------:|:------------------ |
| `-h`, `--help` | Help for `secret find` |            |                    |
| `-o`, `--org`  | Organization name      | string     | `INFLUX_ORG`       |
| `--org-id`     | Organization ID        | string     | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
