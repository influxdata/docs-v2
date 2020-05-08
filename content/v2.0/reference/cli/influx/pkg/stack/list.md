---
title: influx pkg stack list
description: >
  The 'influx pkg stack list' command lists InfluxDB stacks and associated resources.
menu:
  v2_0_ref:
    name: influx pkg stack list
    parent: influx pkg stack
weight: 201
v2.0/tags: [templates]
---

The `influx pkg stack list` command lists InfluxDB stacks and associated resources.

## Usage
```
influx pkg stack list [flags]
```

#### Aliases
`list`, `ls`

## Flags
| Flag             | Description                           | Input type      | {{< cli/mapped >}}    |
|:----             |:-----------                           |:----------:     |:------------------    |
| `-h`, `--help`   | Help for the `list` command           |                 |                       |
| `--hide-headers` | Hide table headers (default `false`)  |                 | `INFLUX_HIDE_HEADERS` |
| `--json`         | Output data as JSON (default `false`) |                 | `INFLUX_OUTPUT_JSON`  |
| `-o`, `--org`    | Organization name                     | string          | `INFLUX_ORG`          |
| `--org-id`       | Organization ID                       | string          | `INFLUX_ORG_ID`       |
| `--stack-id`     | Stack IDs to filter by                | list of strings |                       |
| `--stack-name`   | Stack names to filter by              | list of strings |                       |

{{% cli/influx-global-flags %}}
