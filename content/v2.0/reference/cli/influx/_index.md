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
weight: 101
v2.0/tags: [cli]
---

The `influx` command line interface (CLI) includes commands to manage many aspects of InfluxDB,
including buckets, organizations, users, tasks, etc.

## Usage
```
influx [flags]
influx [command]
```

{{% note %}}
#### Store your InfluxDB authentication token
To avoid having to pass your InfluxDB [authentication token](/v2.0/users/tokens/)
with each `influx` command, use one of the following methods to store your token:

1.  Set the `INFLUX_TOKEN` environment variable using your token.

    ```bash
    export INFLUX_TOKEN=oOooYourAuthTokenOoooOoOO==
    ```

2.  Store your token in `~/.influxdbv2/credentials`.
    _The content of the `credentials` file should be only your token._

    _**Note:** If you [set up InfluxDB using the CLI](/v2.0/reference/cli/influx/setup),
    InfluxDB stores your token in the credentials files automatically._

_See [View tokens](/v2.0/security/tokens/view-tokens/) for information about
retrieving authentication tokens._
{{% /note %}}

## Commands
| Command                                     | Description                                          |
|:-------                                     |:-----------                                          |
| [auth](/v2.0/reference/cli/influx/auth)     | Authorization management commands                    |
| [bucket](/v2.0/reference/cli/influx/bucket) | Bucket management commands                           |
| [delete](/v2.0/reference/cli/influx/delete) | Delete points from InfluxDB                          |
| [help](/v2.0/reference/cli/influx/help)     | Help about any command                               |
| [org](/v2.0/reference/cli/influx/org)       | Organization management commands                     |
| [ping](/v2.0/reference/cli/influx/ping)     | Check the InfluxDB `/health` endpoint                |
| [query](/v2.0/reference/cli/influx/query)   | Execute a Flux query                                 |
| [repl](/v2.0/reference/cli/influx/repl)     | Interactive REPL (read-eval-print-loop)              |
| [setup](/v2.0/reference/cli/influx/setup)   | Create default username, password, org, bucket, etc. |
| [task](/v2.0/reference/cli/influx/task)     | Task management commands                             |
| [user](/v2.0/reference/cli/influx/user)     | User management commands                             |
| [write](/v2.0/reference/cli/influx/write)   | Write points to InfluxDB                             |

{{% influx-cli-global-flags %}}

## Flags
| Flag           | Description                   |
|:---------------|:------------------------------|
| `-h`, `--help` | Help for the `influx` command |
