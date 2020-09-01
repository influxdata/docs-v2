---
title: influx - InfluxDB command line interface
seotitle: influx - InfluxDB command line interface
description: >
  The `influx` CLI includes commands to manage many aspects of InfluxDB,
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
#### Set your credentials

1. To avoid having to pass your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/view-tokens/) with each `influx` command, set up a configuration profile if you haven't already.
2. To see if you have a configuration profile, run `influx config`. If nothing is displayed, you don't have a configuration profile.
3. To configure a profile, in a terminal, run the following command:

  ```sh
   # Set up a configuration profile
   influx config create -n default \
     -u http://localhost:9999 \
     -o example-org \
     -t mySuP3rS3cr3tT0keN \
     -a
  ```

   This configures a new profile named `default` and makes the profile active so commands run against this instance.
   For more detail, see [influx config](/influxdb/v2.0/reference/cli/influx/config/).
{{% /note %}}

## Commands
| Command                                             | Description                                          |
|:-------                                             |:-----------                                          |
| [apply](/v2.0/reference/cli/influx/apply)           | Apply an InfluxDB template                           |
| [auth](/v2.0/reference/cli/influx/auth)             | Authorization management commands                    |
| [backup](/v2.0/reference/cli/influx/backup)         | Back up data                                         |
| [bucket](/v2.0/reference/cli/influx/bucket)         | Bucket management commands                           |
| [completion](/v2.0/reference/cli/influx/completion) | Generate completion scripts                          |
| [config](/v2.0/reference/cli/influx/config)         | Configuration management commands                    |
| [dashboards](/v2.0/reference/cli/influx/dashboards) | List dashboards                                      |
| [delete](/v2.0/reference/cli/influx/delete)         | Delete points from InfluxDB                          |
| [export](/v2.0/reference/cli/influx/export)         | Export resources as a template                       |
| [help](/v2.0/reference/cli/influx/help)             | Help about any command                               |
| [org](/v2.0/reference/cli/influx/org)               | Organization management commands                     |
| [ping](/v2.0/reference/cli/influx/ping)             | Check the InfluxDB `/health` endpoint                |
| [query](/v2.0/reference/cli/influx/query)           | Execute a Flux query                                 |
| [repl](/v2.0/reference/cli/influx/repl)             | Interactive REPL (read-eval-print-loop)              |
| [secret](/v2.0/reference/cli/influx/secret)         | Manage secrets                                       |
| [setup](/v2.0/reference/cli/influx/setup)           | Create default username, password, org, bucket, etc. |
| [stacks](/v2.0/reference/cli/influx/stacks)         | Manage InfluxDB stacks                               |
| [task](/v2.0/reference/cli/influx/task)             | Task management commands                             |
| [telegrafs](/v2.0/reference/cli/influx/telegrafs)   | Telegraf configuration management commands           |
| [template](/v2.0/reference/cli/influx/template)     | Summarize and validate an InfluxDB template          |
| [transpile](/v2.0/reference/cli/influx/transpile)   | Manually transpile an InfluxQL query to Flux         |
| [user](/v2.0/reference/cli/influx/user)             | User management commands                             |
| [write](/v2.0/reference/cli/influx/write)           | Write points to InfluxDB                             |

## Mapped environment variables
Some `influx` CLI flags are mapped to environment variables.
Mapped flags get the value of the environment variable.
To override environment variables, set the flag explicitly in your command.

## Flags
| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `influx` command |
