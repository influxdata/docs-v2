---
title: Replicate data remotely
seotitle:
weight: 106
description: >

menu:
  influxdb_2_1:
    name: Troubleshoot issues
    parent: Write data
influxdb/v2.1/tags: []
related:
  - /influxdb/v2.1/reference/cli/influx/remote
  - /influxdb/v2.1/reference/cli/influx/replication
---

Create a new replication stream to write DATA.

A replication stream uses a *remote connection*.

## Create a remote connection

You will need a remote connection
with which to associate the replication stream

Create a new remote connection by running:

```sh
influx remote create --name <name> --remote-url <url> --remote-api-token <token> --remote-org-id <id>
```

or use an existing connection.
To view existing connections, run `influx remote list`.

## Create replication stream

Once you have a remote connection registered,
you can then create a replication stream to be associated with that remote connection.

To create a replication stream:

```sh
influx replication create --name <name> --remote-id <id> --local-bucket <id> --remote-bucket <id>
```

Once a replication stream is created,
use the `influx replication list` command 
to view information such as the current queue size, max queue size, and latest status code.

{{% note %}}
Note:

- Only writes are streamed.
  Other data operations (e.g. deletes, backup restores) do not affect replication.
  This can cause data in the local bucket to be different than the remote.
- Large writes are always written together locally, but they will be batched when sent to the remote bucket.
  The maximum batch size is 500 kB<!-- , which is typically about 250 to 500 lines -->.
  This may result in scenarios where some batches fail and others do not.
{{% /note %}}
