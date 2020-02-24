---
title: influx bucket update
description: The 'influx bucket update' command updates information associated with buckets in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket update
    parent: influx bucket
weight: 201
---

The `influx bucket update` command updates information associated with buckets in InfluxDB.

## Usage
```
influx bucket update [flags]
```

## Flags
| Flag                | Description                           | Input type  | {{< cli/mapped >}}   |
|:----                |:-----------                           |:----------: |:------------------   |
| `-h`, `--help`      | Help for the `update` command         |             |                      |
| `-i`, `--id`        | The bucket ID **(Required)**          | string      |                      |
| `-n`, `--name`      | New bucket name                       | string      | `INFLUX_BUCKET_NAME` |
| `-r`, `--retention` | New duration data will live in bucket | duration    |                      |

{{% cli/influx-global-flags %}}
