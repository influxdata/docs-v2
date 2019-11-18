---
title: influx user delete
description: The 'influx user delete' command deletes a specified user.
menu:
  v2_0_ref:
    name: influx user delete
    parent: influx user
weight: 201
---

The `influx user delete` command deletes a specified user in InfluxDB.

## Usage
```
influx user delete [flags]
```

## Flags
| Flag           | Description                | Input type  |
|:----           |:-----------                |:----------: |
| `-h`, `--help` | Help for `delete`          |             |
| `-i`, `--id`   | The user ID **(Required)** | string      |

{{% influx-cli-global-flags %}}
