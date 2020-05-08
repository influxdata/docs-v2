---
title: influx pkg stack remove
description: The 'influx pkg stack remove' command removes an InfluxDB stack.
menu:
  v2_0_ref:
    name: influx pkg stack remove
    parent: influx pkg stack
weight: 201
v2.0/tags: [templates]
---

The `influx pkg stack remove` command removes an InfluxDB stack.

## Usage
```
influx pkg stack remove [flags]
```

#### Aliases
`remove`, `rm`, `uninstall`

## Flags
| Flag             | Description                           | Input type      | {{< cli/mapped >}}    |
|:----             |:-----------                           |:----------:     |:------------------    |
| `-h`, `--help`   | Help for the `remove` command         |                 |                       |
| `--hide-headers` | Hide table headers (default `false`)  |                 | `INFLUX_HIDE_HEADERS` |
| `--json`         | Output data as JSON (default `false`) |                 | `INFLUX_OUTPUT_JSON`  |
| `-o`, `--org`    | Organization name                     | string          | `INFLUX_ORG`          |
| `--org-id`       | Organization ID                       | string          | `INFLUX_ORG_ID`       |
| `--stack-id`     | Stack IDs to remove                   | list of strings |                       |

{{% cli/influx-global-flags %}}
