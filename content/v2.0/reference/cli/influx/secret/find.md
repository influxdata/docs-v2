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
| Flag           | Description            | Input type |
|:----           |:-----------            |:----------:|
| `-h`, `--help` | Help for `secret find` |            |
| `-o`, `--org`  | Organization name      | string     |
| `--org-id`     | Organization ID        | string     |

{{% influx-cli-global-flags %}}
