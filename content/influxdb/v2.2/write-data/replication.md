---
title: Replicate data to a remote InfluxDB instance (InfluxDB Edge Data Replication)
weight: 106
description: >
  Use InfluxDB Edge Data Replication to replicate the incoming data of select buckets to one or more buckets on a remote InfluxDB instance.

menu:
  influxdb_2_2:
    name: Replicate data
    parent: Write data
influxdb/v2.2/tags: [write, replication]
related:
  - /influxdb/v2.2/reference/cli/influx/remote
  - /influxdb/v2.2/reference/cli/influx/replication
---

Use InfluxDB replication streams (InfluxDB Edge Data Replication) to replicate the incoming data of select buckets to one or more buckets on a remote InfluxDB instance.

## Configure a replication stream

1. [Download and install the `influx` CLI](/influxdb/v2.2/tools/influx-cli/).
2. In your {{% oss-only %}}local{{% /oss-only %}} InfluxDB OSS instance, use the `influx remote create` command to create a remote connection to replicate data to.

   Provide the following:
    
    {{% oss-only %}}

    - Remote connection name
    - Remote InfluxDB instance URL
    - Remote InfluxDB API token _(API token must have write access to the target bucket)_
    - Remote InfluxDB organization ID

    {{% /oss-only %}}
    {{% cloud-only %}}

    - Remote connection name
    - [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/)
    - InfluxDB Cloud API token _(API token must have write access to the target bucket)_
    - InfluxDB Cloud organization ID

    {{% /cloud-only %}}

    ```sh
    influx remote create \
      --name example-remote-name \
      --remote-url cloud2.influxdata.com \
      --remote-api-token mYsuP3r5Ecr37t0k3n \
      --remote-org-id 00xoXXoxXX00
    ```

    If you already have remote InfluxDB connections configured, you can use an existing connection. To view existing connections, run `influx remote list`.

3. In your {{% oss-only %}}local{{% /oss-only %}} InfluxDB OSS instance, use the
    `influx replication create` command to create a replication stream.
    Provide the following:

    {{% oss-only %}}

    - Replication stream name
    - Remote connection ID
    - Local bucket ID to replicate writes from
    - Remote bucket ID to replicate writes to

    {{% /oss-only %}}
    {{% cloud-only %}}

    - Replication stream name
    - Remote connection ID
    - InfluxDB OSS bucket ID to replicate writes from
    - InfluxDB Cloud bucket ID to replicate writes to

    {{% /cloud-only %}}

    ```sh
    influx replication create \
      --name example-replication-stream-name \
      --remote-id 00xoXXXo0X0x \
      --local-bucket-id Xxxo00Xx000o \
      --remote-bucket-id 0xXXx00oooXx
    ```

Once a replication stream is created, InfluxDB {{% oss-only %}}OSS{{% /oss-only %}}
will replicate all writes to the specified bucket to the {{% oss-only %}}remote {{% /oss-only %}}
InfluxDB {{% cloud-only %}}Cloud {{% /cloud-only %}}bucket.
Use the `influx replication list` command to view information such as the current queue size,
max queue size, and latest status code.

{{% note %}}
#### Important things to note

- Only write operations are replicated. Other data operations (like deletes or restores) are not replicated.
- In InfluxDB OSS, large write request bodies are written entirely.
  When replicated, write requests are sent to the remote bucket in batches.
  The maximum batch size is 500 kB (typically between 250 to 500 lines of line protocol).
  This may result in scenarios where some batches succeed and others fail.
{{% /note %}}

## Replicate downsampled or processed data
In some cases, you may not want to write raw, high-precision data to a remote InfluxDB {{% cloud-only %}}Cloud {{% /cloud-only %}} instance. To replicate only downsampled or processed data:

1. Create a bucket in your InfluxDB OSS instance to store downsampled or processed data in.
2. Create an InfluxDB task that downsamples or processes data and stores it in the new bucket. For example:

    ```js
    import "influxdata/influxdb/tasks"
    import "types"

    option task = {name: "Downsample raw data", every: 10m}

    data = () => from(bucket: "example-bucket")
        |> range(start: tasks.lastSuccess(orTime: -task.every))

    numeric = data()
        |> filter(fn: (r) => types.isType(v: r._value, type: "float") or types.isType(v: r._value, type: "int") or types.isType(v: r._value, type: "uint"))
        |> aggregateWindow(every: -task.every, fn: mean)

    nonNumeric = data()
        |> filter(fn: (r) => types.isType(v: r._value, type: "string") or types.isType(v: r._value, type: "bool"))
        |> aggregateWindow(every: -task.every, fn: last)

    union(tables: [numeric, nonNumeric])
        |> to(bucket: "example-downsampled-bucket"])
    ```

3. [Create a replication stream](#configure-a-replication-stream) to replicate data from the downsampled bucket to the remote InfluxDB {{% cloud-only %}}Cloud {{% /cloud-only %}}instance.
