---
title: influx bucket create
description: The 'influx bucket create' command creates a new bucket in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket create
    parent: influx bucket
weight: 201
---

The `influx bucket create` command creates a new bucket in InfluxDB.

## Usage
```
influx bucket create [flags]
```

## Flags
| Flag                | Description                                       | Input type  | {{< cli/mapped >}}   |
|:----                |:-----------                                       |:----------: |:------------------   |
| `-h`, `--help`      | Help for the `create` command                     |             |                      |
| `-n`, `--name`      | Name of bucket that will be created               | string      | `INFLUX_BUCKET_NAME` |
| `-o`, `--org`       | The name of the organization that owns the bucket | string      | `INFLUX_ORG`         |
| `--org-id`          | The ID of the organization that owns the bucket   | string      | `INFLUX_ORG_ID`      |
| `-r`, `--retention` | Duration in nanoseconds data will live in bucket  | duration    |                      |

{{% cli/influx-global-flags %}}
