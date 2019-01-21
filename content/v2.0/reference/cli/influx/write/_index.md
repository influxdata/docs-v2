---
title: influx write – Write data to InfluxDB using the CLI
description: >
  The 'influx write' command writes line protocol to InfluxDB either via a single
  line of line protocol, or a via a file containing line protocol.
menu:
  v2_0_ref:
    name: influx write
    parent: influx
    weight: 1
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

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
