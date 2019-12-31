---
title: influx user create
description: The 'influx user create' command creates a user in InfluxDB.
menu:
  v2_0_ref:
    name: influx user create
    parent: influx user
weight: 201
---

The `influx user create` command creates a new user in InfluxDB.

## Usage
```
influx user create [flags]
```

## Flags
| Flag               | Description                                     | Input type  |
|:----               |:-----------                                     |:----------: |
| `-h`, `--help`     | Help for `create`                               |             |
| `-n`, `--name`     | The username **(Required)**                     | string      |
| `-o`, `--org`      | The name of the organization to add the user to | string      |
| `--org-id`         | The ID fo the organization to add the user to   | string      |
| `-p`, `--password` | The user password                               | string      |

{{% influx-cli-global-flags %}}
