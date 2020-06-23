---
title: influx secret list
description: The `influx secret list` command lists secret keys.
menu:
  v2_0_ref:
    name: influx secret list
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret list` command lists secret keys.

## Usage
```
influx secret list [flags]
```

#### Aliases
`list`, `ls`, `find`

## Flags
| Flag |                  | Description                           | Input type | {{< cli/mapped >}}    |
|:---- |:---              |:-----------                           |:----------:|:------------------    |
| `-h` | `--help`         | Help for the `list` command           |            |                       |
|      | `--hide-headers` | Hide table headers (default `false`)  |            | `INFLUX_HIDE_HEADERS` |
|      | `--json`         | Output data as JSON (default `false`) |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`          | Organization name                     | string     | `INFLUX_ORG`          |
|      | `--org-id`       | Organization ID                       | string     | `INFLUX_ORG_ID`       |

{{% cli/influx-global-flags %}}
