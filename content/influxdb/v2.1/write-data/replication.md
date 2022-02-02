---
title: Replicate data to a remote InfluxDB instance
weight: 106
description: >
  Use InfluxDB replication streams to replicate all data written to an InfluxDB OSS
  instance to InfluxDB Cloud or a remote InfluxDB OSS instance.
menu:
  influxdb_2_1:
    name: Replicate data
    parent: Write data
influxdb/v2.1/tags: []
related:
  - /influxdb/v2.1/reference/cli/influx/remote
  - /influxdb/v2.1/reference/cli/influx/replication
---

Use InfluxDB replication streams to replicate all data written to an InfluxDB OSS
bucket to an InfluxDB Cloud or a remote InfluxDB OSS bucket.

**To configure a replication stream:**

1. [Download and install the `influx` CLI](https://docs.influxdata.com/influxdb/v2.1/tools/influx-cli/).
2. Use the `influx remote create` command to create a remote connection to replicate data to.
    Provide the following:
    
    - Remote connection name
    - Remote InfluxDB instance URL
    - Remote InfluxDB API token _(API token must have write access to the target bucket)_
    - Remote InfluxDB organization ID

    ```sh
    influx remote create \
      --name example-remote-name \
      --remote-url cloud2.influxdata.com \
      --remote-api-token mYsuP3r5Ecr37t0k3n \
      --remote-org-id 00xoXXoxXX00
    ```

    If you already have remote InfluxDB connections configured, you can use an existing connection.
    To view existing connections, run `influx remote list`.

2. Use the `influx replication create` command to create a replication stream.
    Provide the following:

    - Replication stream name
    - Remote connection ID
    - Local bucket ID to replicate writes from
    - Remote bucket ID to replicate writes to

    ```sh
    influx replication create \
      --name example-replication-stream-name \
      --remote-id 00xoXXXo0X0x \
      --local-bucket Xxxo00Xx000o \
      --remote-bucket 0xXXx00oooXx
    ```

Once a replication stream is created, InfluxDB will replicate all writes to the specified bucket
to the remote InfluxDB bucket.
Use the `influx replication list` command to view information such as the current queue size,
max queue size, and latest status code.

{{% note %}}
Note:

- Only writes are streamed.
  Other data operations (e.g. deletes, backup restores) do not affect replication.
  This can cause data in the local bucket to be different than the remote.
- Large writes are always written together locally, but they will be batched when sent to the remote bucket.
  The maximum batch size is 500 kB<!-- , which is typically about 250 to 500 lines -->.
  This may result in scenarios where some batches fail and others do not.
{{% /note %}}
