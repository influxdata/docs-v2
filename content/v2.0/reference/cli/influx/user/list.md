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
| Flag             | Description                           | Input type  | {{< cli/mapped >}}    |
|:----             |:-----------                           |:----------: |:------------------    |
| `-h`, `--help`   | Help for the `list` command           |             |                       |
| `--hide-headers` | Hide table headers (default `false`)  |             | `INFLUX_HIDE_HEADERS` |
| `-i`, `--id`     | User ID                               | string      |                       |
| `--json`         | Output data as JSON (default `false`) |             | `INFLUX_OUTPUT_JSON`  |
| `-n`, `--name`   | Username                              | string      |                       |

{{% cli/influx-global-flags %}}
