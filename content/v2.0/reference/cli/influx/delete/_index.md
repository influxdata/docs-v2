---
title: influx delete – Delete data from InfluxDB
description: The 'influx delete' command deletes points from InfluxDB.
menu:
  v2_0_ref:
    name: influx delete
    parent: influx
weight: 101
v2.0/tags: [delete]
---

The `influx delete` command deletes points from InfluxDB.

## Usage
```
influx delete [flags]
```

## Flags
| Flag                | Description                                                             | Input type |
|:----                |:-----------                                                             |:----------:|
| `-b`, `--bucket`    | The name of bucket to remove data from                                  | string     |
| `--bucket-id`       | The ID of the bucket to remove data from                                | string     |
| `-h`, `--help`      | Help for the `delete` command                                           |            |
| `-o`, `--org`       | The name of the organization that owns the bucket                       | string     |
| `--org-id`          | The ID of the organization that owns the bucket                         | string     |
| `-p`, `--predicate` | SQL-like predicate string, (example: `tag1="v1" and tag2=123`)          | string     |
| `--start`           | The start time in RFC3339Nano format, (example: `2009-01-02T23:00:00Z`) | string     |
| `--stop`            | The stop time in RFC3339Nano format, (example: `2009-01-02T23:00:00Z`)  | string     |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
