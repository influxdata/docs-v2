---
title: influx secret list
description: The 'influx secret list' command lists secret keys.
menu:
  v2_0_ref:
    name: influx secret list
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret list` command lists secret keys.

## Usage
```
influx secret list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag           | Description            | Input type |
|:----           |:-----------            |:----------:|
| `-h`, `--help` | Help for `secret list` |            |
| `-o`, `--org`  | Organization name      | string     |
| `--org-id`     | Organization ID        | string     |

{{% influx-cli-global-flags %}}
