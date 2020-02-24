---
title: influx bucket find
description: The 'influx bucket find' command lists and searches for buckets in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket find
    parent: influx bucket
weight: 201
---

The `influx bucket find` command lists and searches for buckets in InfluxDB.

## Usage
```
influx bucket find [flags]
```

## Flags
| Flag           | Description                  | Input type  | {{< cli/mapped >}}   |
|:----           |:-----------                  |:----------: |:------------------   |
| `-h`, `--help` | Help for the `find` command  |             |                      |
| `-i`, `--id`   | The bucket ID                | string      |                      |
| `-n`, `--name` | The bucket name              | string      | `INFLUX_BUCKET_NAME` |
| `-o`, `--org`  | The bucket organization name | string      | `INFLUX_ORG`         |
| `--org-id`     | The bucket organization ID   | string      | `INFLUX_ORG_ID`      |

{{% cli/influx-global-flags %}}
