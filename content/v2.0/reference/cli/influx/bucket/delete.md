---
title: influx bucket delete
description: The 'influx bucket delete' command deletes a bucket from InfluxDB and all the data it contains.
menu:
  v2_0_ref:
    name: influx bucket delete
    parent: influx bucket
weight: 201
---

The `influx bucket delete` command deletes a bucket from InfluxDB and all the data it contains.

## Usage
```
influx bucket delete [flags]
```

## Flags
| Flag           | Description                   | Input type  |
|:----           |:-----------                   |:----------: |
| `-h`, `--help` | Help for the `delete` command |             |
| `-i`, `--id`   | The bucket ID **(Required)**  | string      |

{{% cli/influx-global-flags %}}
