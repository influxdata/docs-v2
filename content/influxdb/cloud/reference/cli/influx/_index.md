---
title: influx - InfluxDB command line interface
seotitle: influx - InfluxDB command line interface
description: >
  The `influx` CLI includes commands to manage many aspects of InfluxDB,
  including buckets, organizations, users, tasks, etc.
menu:
  influxdb_cloud_ref:
    name: influx
    parent: Command line tools
weight: 101
influxdb/cloud/tags: [cli]
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

1. To avoid having to pass your InfluxDB [authentication token](/influxdb/cloud/security/tokens/view-tokens/) with each `influx` command, set up a configuration profile if you haven't already.
2. To see if you have a configuration profile, run `influx config`. If nothing is displayed, you don't have a configuration profile.
3. To configure a profile, in a terminal, run the following command:

  ```sh
   # Set up a configuration profile
   influx config create -n default \
     -u https://cloud2.influxdata.com \
     -o example-org \
     -t mySuP3rS3cr3tT0keN \
     -a
  ```

   This configures a new profile named `default` and makes the profile active so commands run against this instance.
   For more detail, see [influx config](/influxdb/cloud/reference/cli/influx/config/).
{{% /note %}}

## Commands

| Command                                                      | Description                                          |
|:-------                                                      |:-----------                                          |
| [apply](/influxdb/cloud/reference/cli/influx/apply)           | Apply an InfluxDB template                           |
| [auth](/influxdb/cloud/reference/cli/influx/auth)             | Authorization management commands                    |
| [backup](/influxdb/cloud/reference/cli/influx/backup)         | Back up data                                         |
| [bucket](/influxdb/cloud/reference/cli/influx/bucket)         | Bucket management commands                           |
| [completion](/influxdb/cloud/reference/cli/influx/completion) | Generate completion scripts                          |
| [config](/influxdb/cloud/reference/cli/influx/config)         | Configuration management commands                    |
| [dashboards](/influxdb/cloud/reference/cli/influx/dashboards) | List dashboards                                      |
| [delete](/influxdb/cloud/reference/cli/influx/delete)         | Delete points from InfluxDB                          |
| [export](/influxdb/cloud/reference/cli/influx/export)         | Export resources as a template                       |
| [help](/influxdb/cloud/reference/cli/influx/help)             | Help about any command                               |
| [org](/influxdb/cloud/reference/cli/influx/org)               | Organization management commands                     |
| [ping](/influxdb/cloud/reference/cli/influx/ping)             | Check the InfluxDB `/health` endpoint                |
| [query](/influxdb/cloud/reference/cli/influx/query)           | Execute a Flux query                                 |
| [secret](/influxdb/cloud/reference/cli/influx/secret)         | Manage secrets                                       |
| [setup](/influxdb/cloud/reference/cli/influx/setup)           | Create default username, password, org, bucket, etc. |
| [stacks](/influxdb/cloud/reference/cli/influx/stacks)         | Manage InfluxDB stacks                               |
| [task](/influxdb/cloud/reference/cli/influx/task)             | Task management commands                             |
| [telegrafs](/influxdb/cloud/reference/cli/influx/telegrafs)   | Telegraf configuration management commands           |
| [template](/influxdb/cloud/reference/cli/influx/template)     | Summarize and validate an InfluxDB template          |
| [transpile](/influxdb/cloud/reference/cli/influx/transpile)   | Manually transpile an InfluxQL query to Flux         |
| [user](/influxdb/cloud/reference/cli/influx/user)             | User management commands                             |
| [write](/influxdb/cloud/reference/cli/influx/write)           | Write points to InfluxDB                             |

## Mapped environment variables

Some `influx` CLI flags are mapped to environment variables.
Mapped flags get the value of the environment variable.
To override environment variables, set the flag explicitly in your command.

## Flags

| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `influx` command |

