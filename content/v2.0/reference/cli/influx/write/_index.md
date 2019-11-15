---
title: influx write – Write data to InfluxDB using the CLI
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
| Flag                | Description                                             | Input type |
|:----                |:-----------                                             |:----------:|
| `-b`, `--bucket`    | The name of destination bucket                          | string     |
| `--bucket-id`       | The ID of destination bucket                            | string     |
| `-h`, `--help`      | Help for the write command                              |            |
| `-o`, `--org`       | The name of the organization that owns the bucket       | string     |
| `--org-id`          | The ID of the organization that owns the bucket         | string     |
| `-p`, `--precision` | Precision of the timestamps of the lines (default `ns`) | string     |

{{% influx-cli-global-flags %}}
