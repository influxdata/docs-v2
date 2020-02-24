---
title: influx user password
description: The `influx user password` command updates the password for a user in InfluxDB.
menu:
  v2_0_ref:
    name: influx user password
    parent: influx user
weight: 201
related:
  - /v2.0/users/change-password/
---

The `influx user password` command updates the password for a user in InfluxDB.

## Usage
```
influx user password [flags]
```

## Flags
| Flag           | Description                     | Input type  |
|:----           |:-----------                     |:----------: |
| `-h`, `--help` | Help for the `password` command |             |
| `-i`, `--id`   | User ID                         | string      |
| `-n`, `--name` | Username                        | string      |

{{% cli/influx-global-flags %}}
