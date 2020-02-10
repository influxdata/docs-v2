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
influx secret delete [command]
```

## Flags
| Flag           | Description                 | Input type |
|:----           |:-----------                 |:----------:|
| `-h`, `--help` | Help for `delete`           |            |
| `-k`, `--key`  | Secret key _**(required)**_ | string     |
| `-o`, `--org`  | Organization name           | string     |
| `--org-id`     | Organization ID             | string     |

{{% influx-cli-global-flags %}}
