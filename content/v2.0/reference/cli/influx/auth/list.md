---
title: influx auth list
description: The 'influx auth list' command lists and searches authorizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth list
    parent: influx auth
weight: 201
aliases:
  - /v2.0/reference/cli/influx/auth/find
---

The `influx auth list` command lists and searches authorizations in InfluxDB.

## Usage
```
influx auth list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag           | Description                 | Input type  |
|:----           |:-----------                 |:----------: |
| `-h`, `--help` | Help for the `list` command |             |
| `-i`, `--id`   | The authorization ID        | string      |
| `-o`, `--org`  | The organization            | string      |
| `--org-id`     | The organization ID         | string      |
| `-u`, `--user` | The user                    | string      |
| `--user-id`    | The user ID                 | string      |

{{% influx-cli-global-flags %}}
