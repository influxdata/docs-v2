---
title: influx remote
description: Manage remote connections for replicating data
menu:
  influxdb_2_1_ref:
    name: influx remote
    parent: influx
weight: 101
influxdb/v2.1/tags: [write]
related:
  - /influxdb/v2.1/reference/cli/influx/replication
---

The `influx remote` command

This feature will allow users to replicate data at the bucket level to
one or more remote instances of InfluxDB. The following user stories illustrate
why this feature is useful:

- As a user, I have multiple edge deployments of InfluxDB OSS that are collecting data locally. I would like an easy way to analyze this data in aggregate.

- As a user, I have multiple edge deployments of InfluxDB OSS that are collecting data locally with limited or no connectivity to the cloud. I would like an easy way to analyze this data in aggregate once network connection is restored.

## Usage
```
influx remote [commond options] [arguments...]
```

## Subcommands
|:------------------------------------------------------------|:--|
| [create](/influxdb/v2.1/reference/cli/influx/remote/create) |   |
| [delete](/influxdb/v2.1/reference/cli/influx/remote/delete) |   |
| [list](/influxdb/v2.1/reference/cli/influx/remote/list)     |   |
| [update](/influxdb/v2.1/reference/cli/influx/remote/update) |   |

## Flags
| Flag |          | Description                   | Input type | {{< cli/mapped >}} |
|:-----|:---------|:------------------------------|:----------:|:-------------------|
| `-h` | `--help` | Help for the `remote` command |            |                    |

<!--
How to use:

In order to create a new replication stream, you must have a remote connection
that the replication will be associated with set up first. You can either
use one you have previously registered (use `influx remote list` command
to view existing connections) or create a new one.

Example:
`influx remote create --name <name> --remote-url <url> --remote-api-token <token> --remote-org-id <id>`

Once you have a remote connection registered, you can then create a replication
stream to be associated with that remote connection.

Example:
`influx replication create --name <name> --remote-id <id> --local-bucket <id> --remote-bucket <id>`

Once a replication stream is created, you can view information such as
the current queue size, max queue size, and latest status code using the
`influx replication list` command.

Things to Note:

- Only writes are streamed. Other data operations (e.g. deletes, backup
restores) do not affect replication. This can cause data in the local bucket
to be different than the remote.

- Large writes are always written together locally, but they will be batched
when sent to the remote bucket. The maximum batch size is 500 kB, which
is typically about 250 to 500 lines. This may result in scenarios where
some batches fail, and others do not.

 -->
