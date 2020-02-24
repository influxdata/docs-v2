---
title: influx delete – Delete data from InfluxDB
description: The 'influx delete' command deletes points from an InfluxDB bucket.
menu:
  v2_0_ref:
    name: influx delete
    parent: influx
weight: 101
v2.0/tags: [delete]
---

The `influx delete` command deletes [points](/v2.0/reference/glossary/#point)
from an InfluxDB bucket.

## Usage
```
influx delete [flags]
```

{{% warn %}}
Running `influx delete` without the `-p` or `--predicate` flag deletes all data with
timestamps between the specified `--start` and `--stop` times in the specified bucket.
{{% /warn %}}

## Flags
| Flag                | Description                                                                                      | Input type | {{< cli/mapped >}}   |
|:----                |:-----------                                                                                      |:----------:|:------------------   |
| `-b`, `--bucket`    | Name of bucket to remove data from                                                               | string     | `INFLUX_BUCKET_NAME` |
| `--bucket-id`       | Bucket ID                                                                                        | string     | `INFLUX_BUCKET_ID`   |
| `-h`, `--help`      | Help for the `delete` command                                                                    |            |                      |
| `-o`, `--org`       | Organization name                                                                                | string     | `INFLUX_ORG`         |
| `--org-id`          | Organization ID                                                                                  | string     | `INFLUX_ORG_ID`      |
| `-p`, `--predicate` | InfluxQL-like predicate string (see [Delete predicate](/v2.0/reference/syntax/delete-predicate)) | string     |                      |
| `--start`           | Start time in RFC3339 format (i.e. `2009-01-02T23:00:00Z`)                                       | string     |                      |
| `--stop`            | Stop time in RFC3339 format (i.e. `2009-01-02T23:00:00Z`)                                        | string     |                      |

{{% cli/influx-global-flags %}}
