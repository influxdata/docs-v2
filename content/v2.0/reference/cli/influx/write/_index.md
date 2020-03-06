---
title: influx write
description: >
  The 'influx write' command writes line protocol to InfluxDB either via a single
  line of line protocol, or a via a file containing line protocol.
menu:
  v2_0_ref:
    name: influx write
    parent: influx
weight: 101
v2.0/tags: [write]
---

The `influx write` writes a single line of line protocol to InfluxDB,
or adds an entire file specified with an `@` prefix.

## Usage
```
influx write [line protocol or @/path/to/points.txt] [flags]
```

## Flags
| Flag                | Description                                | Input type | {{< cli/mapped >}}   |
|:----                |:-----------                                |:----------:|:------------------   |
| `-b`, `--bucket`    | Bucket name                                | string     | `INFLUX_BUCKET_NAME` |
| `--bucket-id`       | Bucket ID                                  | string     | `INFLUX_BUCKET_ID`   |
| `-h`, `--help`      | Help for the `write` command               |            |                      |
| `-o`, `--org`       | Organization name                          | string     | `INFLUX_ORG`         |
| `--org-id`          | Organization ID                            | string     | `INFLUX_ORG_ID`      |
| `-p`, `--precision` | Precision of the timestamps (default `ns`) | string     | `INFLUX_PRECISION`   |

{{% cli/influx-global-flags %}}
