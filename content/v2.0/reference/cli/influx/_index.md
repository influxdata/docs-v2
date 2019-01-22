---
title: influx - InfluxDB command line interface
seotitle: influx - InfluxDB command line interface
description: >
  The influx CLI includes commands to manage many aspects of InfluxDB,
  including buckets, organizations, users, tasks, etc.
menu:
  v2_0_ref:
    name: influx
    parent: Command line tools
    weight: 1
---

The `influx` command line interface (CLI) includes commands to manage many aspects of InfluxDB,
including buckets, organizations, users, tasks, etc.

## Usage
```
influx [flags]
influx [command]
```

## Commands
| Command                                     | Description                                          |
|:-------                                     |:-----------                                          |
| [auth](/v2.0/reference/cli/influx/auth)     | Authorization management commands                    |
| [bucket](/v2.0/reference/cli/influx/bucket) | Bucket management commands                           |
| [help](/v2.0/reference/cli/influx/help)     | Help about any command                               |
| [org](/v2.0/reference/cli/influx/org)       | Organization management commands                     |
| [query](/v2.0/reference/cli/influx/query)   | Execute a Flux query                                 |
| [repl](/v2.0/reference/cli/influx/repl)     | Interactive REPL (read-eval-print-loop)              |
| [setup](/v2.0/reference/cli/influx/setup)   | Create default username, password, org, bucket, etc. |
| [task](/v2.0/reference/cli/influx/task)     | Task management commands                             |
| [user](/v2.0/reference/cli/influx/user)     | User management commands                             |
| [write](/v2.0/reference/cli/influx/write)   | Write points to InfluxDB                             |

## Flags
| Flag            | Description                                                | Input type |
|:----            |:-----------                                                |:----------:|
| `-h`, `--help`  | Help for the influx command                                |            |
| `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`) | string     |
| `--local`       | Run commands locally against the filesystem                |            |
| `-t`, `--token` | API token to be used throughout client calls               | string     |
