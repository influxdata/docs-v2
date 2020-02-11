---
title: influx user list
description: The 'influx user list' lists users in InfluxDB.
menu:
  v2_0_ref:
    name: influx user list
    parent: influx user
weight: 201
aliases:
  - /v2.0/reference/cli/influx/user/find
---

The `influx user list` command lists users in InfluxDB.

## Usage
```
influx user list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag           | Description     | Input type  |
|:----           |:-----------     |:----------: |
| `-h`, `--help` | Help for `list` |             |
| `-i`, `--id`   | The user ID     | string      |
| `-n`, `--name` | The username    | string      |

{{% influx-cli-global-flags %}}
