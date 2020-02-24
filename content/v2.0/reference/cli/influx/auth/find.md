---
title: influx auth find
description: The 'influx auth find' command lists and searches authorizations in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth find
    parent: influx auth
weight: 201
---

The `influx auth find` command lists and searches authorizations in InfluxDB.

## Usage
```
influx auth find [flags]
```

## Flags
| Flag           | Description                 | Input type  |
|:----           |:-----------                 |:----------: |
| `-h`, `--help` | Help for the `find` command |             |
| `-i`, `--id`   | Authorization ID            | string      |
| `-o`, `--org`  | Organization name           | string      |
| `--org-id`     | Organization ID             | string      |
| `-u`, `--user` | Username                    | string      |
| `--user-id`    | User ID                     | string      |

{{% cli/influx-global-flags %}}
