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
| Flag |                  | Description                           | Input type  | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                           |:----------: |:------------------    |
| `-h` | `--help`         | Help for the `list` command           |             |                       |
|      | `--hide-headers` | Hide table headers (default `false`)  |             | `INFLUX_HIDE_HEADERS` |
| `-i` | `--id`           | Authorization ID                      | string      |                       |
|      | `--json`         | Output data as JSON (default `false`) |             | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                     | string      |                       |
|      | `--org-id`       | Organization ID                       | string      |                       |
| `-u` | `--user`         | Username                              | string      |                       |
|      | `--user-id`      | User ID                               | string      |                       |

{{% cli/influx-global-flags %}}
