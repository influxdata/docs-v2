---
title: influx auth inactive
description: The 'influx auth inactive' inactivates an authorization in InfluxDB.
menu:
  v2_0_ref:
    name: influx auth inactive
    parent: influx auth
weight: 201
---

The `influx auth inactive` inactivates an authorization in InfluxDB.

## Usage
```
influx auth inactive [flags]
```

## Flags
| Flag             | Description                           | Input type  | {{< cli/mapped >}}    |
|:----             |:-----------                           |:----------: |:------------------    |
| `-h`, `--help`   | Help for the `inactive` command       |             |                       |
| `--hide-headers` | Hide table headers (default `false`)  |             | `INFLUX_HIDE_HEADERS` |
| `-i`, `--id`     | **(Required)** Authorization ID       | string      |                       |
| `--json`         | Output data as JSON (default `false`) |             | `INFLUX_OUTPUT_JSON`  |

{{% cli/influx-global-flags %}}
