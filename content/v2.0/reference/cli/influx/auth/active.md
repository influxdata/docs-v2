---
title: influx auth active
description: The 'influx auth active' command activates an authorization.
menu:
  v2_0_ref:
    name: influx auth active
    parent: influx auth
weight: 201
---

The `influx auth active` command activates an authorization in InfluxDB.

## Usage
```
influx auth active [flags]
```

## Flags
| Flag             | Description                           | Input type | {{< cli/mapped >}}    |
|:----             |:-----------                           |:----------:|:------------------    |
| `-h`, `--help`   | Help for the `active` command         |            |                       |
| `--hide-headers` | Hide table headers (default `false`)  |            | `INFLUX_HIDE_HEADERS` |
| `-i`, `--id`     | **(Required)** Authorization ID       | string     |                       |
| `--json`         | Output data as JSON (default `false`) |            | `INFLUX_OUTPUT_JSON`  |

{{% cli/influx-global-flags %}}
