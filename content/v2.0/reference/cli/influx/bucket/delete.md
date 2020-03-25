---
title: influx bucket delete
description: The 'influx bucket delete' command deletes a bucket from InfluxDB and all the data it contains.
menu:
  v2_0_ref:
    name: influx bucket delete
    parent: influx bucket
weight: 201
related:
  - /v2.0/organizations/buckets/delete-bucket/
---

The `influx bucket delete` command deletes a bucket from InfluxDB and all the data it contains.

## Usage
```
influx bucket delete [flags]
```

## Flags
| Flag           | Description                                  | Input type  | {{< cli/mapped >}} |
|:----           |:-----------                                  |:----------: |:------------------ |
| `-h`, `--help` | Help for the `delete` command                |             |                    |
| `-i`, `--id`   | Bucket ID _(required if no `--name`)_        | string      |                    |
| `-n`, `--name` | Bucket name _(requires `--org` or `org-id`)_ | string      |                    |
| `-o`, `--org`  | Organization name                            | string      | `$INFLUX_ORG`      |
| `--org-id`     | Organization ID                              | string      | `$INFLUX_ORG_ID`   |

{{% cli/influx-global-flags %}}
