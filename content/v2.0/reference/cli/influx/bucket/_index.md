---
title: influx bucket – Bucket management commands
description: The 'influx bucket' command and its subcommands manage buckets in InfluxDB.
menu:
  v2_0_ref:
    name: influx bucket
    parent: influx
weight: 101
---

The `influx bucket` command and its subcommands manage buckets in InfluxDB.

## Usage
```
influx bucket [flags]
influx bucket [command]
```

## Subcommands
| Subcommand                                         | Description   |
|:----------                                         |:-----------   |
| [create](/v2.0/reference/cli/influx/bucket/create) | Create bucket |
| [delete](/v2.0/reference/cli/influx/bucket/delete) | Delete bucket |
| [find](/v2.0/reference/cli/influx/bucket/find)     | Find buckets  |
| [update](/v2.0/reference/cli/influx/bucket/update) | Update bucket |

## Flags
| Flag           | Description                   |
|:----           |:-----------                   |
| `-h`, `--help` | Help for the `bucket` command |

## Global flags
| Global flag     | Description                                                | Input type |
|:-----------     |:-----------                                                |:----------:|
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
