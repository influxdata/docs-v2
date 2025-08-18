
Use InfluxDB replication streams (InfluxDB Edge Data Replication) to replicate
the incoming data of select buckets to one or more buckets on a remote 
InfluxDB OSS, InfluxDB Cloud, or InfluxDB Enterprise v1 instance.

Replicate data from InfluxDB OSS to InfluxDB Cloud, InfluxDB OSS, or InfluxDB Enterprise v1.

- [Configure a replication stream](#configure-a-replication-stream)
- [Replicate downsampled or processed data](#replicate-downsampled-or-processed-data)
{{% show-in "v2" %}}
- [View replication service metrics](#view-influxdb-oss-replication-service-metrics)
{{% /show-in %}}

## Configure a replication stream

Use the [`influx` CLI](/influxdb/version/tools/influx-cli/) or the
[InfluxDB {{< current-version >}} API](/influxdb/version/reference/api/) to configure
a replication stream.

> [!Note]
> To replicate data to InfluxDB OSS or InfluxDB Enterprise v1, adjust the
> remote connection values accordingly.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
{{% tab-content %}}

<!--------------------------------- BEGIN CLI --------------------------------->
### Step 1: Create or find a remote connection

- [Create a remote connection](#create-a-remote-connection-cli)
- [Use an existing remote connection](#use-an-existing-remote-connection-cli)

#### Create a remote connection (CLI) 

In your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS instance, use
the `influx remote create` command and provide the following arguments for the remote instance:

{{% show-in "v2" %}}
- Remote connection name
- Remote InfluxDB instance URL
- Remote InfluxDB API token _(API token must have write access to the target bucket)_
- Remote InfluxDB organization ID
{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}
- Remote connection name
- [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/)
- InfluxDB Cloud API token _(API token must have write access to the target bucket)_
- InfluxDB Cloud organization ID
{{% /show-in %}}

 ```sh
 influx remote create \
  --name example-remote-name \
  --remote-url https://cloud2.influxdata.com \
  --remote-api-token mYsuP3r5Ecr37t0k3n \
  --remote-org-id 00xoXXoxXX00
 ```

#### Use an existing remote connection (CLI)

Alternatively, you can use an existing connection that you have already configured.
To retrieve existing connections, run `influx remote list`.

### Step 2: Create a replication stream (CLI)

In your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS instance, use the
`influx replication create` command and provide the following arguments:
    
{{% show-in "v2" %}}
- Replication stream name
- Remote connection ID (created in the previous step)
- Local bucket ID to replicate writes from
- Remote bucket name or ID to replicate writes to. If replicating to **InfluxDB Enterprise v1**, use the `db-name/rp-name` bucket name syntax.{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}
- Replication stream name
- Remote connection ID (created in the previous step)
- InfluxDB OSS bucket ID to replicate writes from
- InfluxDB Cloud bucket ID to replicate writes to
{{% /show-in %}}

```sh
influx replication create \
 --name REPLICATION_STREAM_NAME \
 --remote-id REPLICATION_REMOTE_ID \
 --local-bucket-id INFLUX_BUCKET_ID \
 --remote-bucket REMOTE_INFLUX_BUCKET_NAME
```

After you create the replication stream, InfluxDB {{% show-in "v2" %}}OSS{{% /show-in %}}
replicates all writes to the specified local bucket to the {{% show-in "v2" %}}remote {{% /show-in %}}
InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud {{% /show-in %}}bucket.
Use the `influx replication list` command to view information such as the current queue size,
max queue size, and latest status code.

<!---------------------------------- END CLI ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------------- BEGIN API --------------------------------->

### Step 1: Create or find a remote connection (API)

- [Create a remote connection](#create-a-remote-connection-api)
- [Use an existing remote connection](#use-an-existing-remote-connection-api)

#### Create a remote connection (API)

To create a remote connection to replicate data to,
send a `POST` request to your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS  `/api/v2/remotes` endpoint:

{{< keep-url >}}
{{< api-endpoint endpoint="localhost:8086/api/v2/remotes" method="POST" api-ref="/influxdb/version/api/#operation/PostRemoteConnection" >}}

Include the following parameters in your request:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` scheme with your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS [API token](/influxdb/version/admin/tokens/)
  - **Content-type:** `application/json`
{{% show-in "v2" %}}
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **allowInsecureTLS:** All insecure TLS connections
  - **description:** Remote description
  - {{< req "\*" >}} **name:** Remote connection name
  - {{< req "\*" >}} **orgID:** {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS organization ID
  - {{< req "\*" >}} **remoteAPIToken:** Remote InfluxDB API token _(API token must have write access to the target bucket)_
  - {{< req "\*" >}} **remoteOrgID:** Remote InfluxDB organization ID
  - {{< req "\*" >}} **remoteURL:** Remote InfluxDB instance URL
{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **allowInsecureTLS:** All insecure TLS connections
  - **description:** Remote description
  - {{< req "\*" >}} **name:** Remote connection name
  - {{< req "\*" >}} **orgID:** {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS organization ID
  - {{< req "\*" >}} **remoteAPIToken:** InfluxDB Cloud API token _(API token must have write access to the target bucket)_
  - {{< req "\*" >}} **remoteOrgID:** InfluxDB Cloud organization ID
  - {{< req "\*" >}} **remoteURL:** [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/)
{{% /show-in %}}

{{< keep-url >}}
```sh
curl --request POST http://localhost:8086/api/v2/remotes \
  --header 'Authorization: Token INFLUX_OSS_TOKEN' \
  --data '{
    "allowInsecureTLS": false,
    "description": "Example remote description",
    "name": "Example remote name",
    "orgID": "INFLUX_OSS_ORG_ID",
    "remoteAPIToken": "REMOTE_INFLUX_TOKEN",
    "remoteOrgID": "REMOTE_INFLUX_ORG_ID",
    "remoteURL": "https://cloud2.influxdata.com"
  }'
```

#### Use an existing remote connection (API)

Alternatively, you can use an
existing connection that you have already configured.
To retrieve existing connections, use the `/api/v2/remotes`
endpoint with the `GET` request method:

{{< keep-url >}}
{{< api-endpoint endpoint="localhost:8086/api/v2/remotes" method="GET" api-ref="/influxdb/version/api/#operation/GetRemoteConnections" >}}

Include the following parameters in your request:

- **Headers:**
  - **Authorization:** `Token` scheme with your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS [API token](/influxdb/version/admin/tokens/)
- **Query parameters:**
  - **orgID:** {{% show-in "v2" %}}Local{{% /show-in %}} InfluxDB OSS organization ID

{{< keep-url >}}
```sh
curl --request GET \
  http://localhost:8086/api/v2/remotes?orgID=INFLUX_OSS_ORG_ID \
  --header 'Authorization: Token INFLUX_OSS_TOKEN' \
```

### Step 2: Create a replication stream (API)

Send a `POST` request to your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS
`/api/v2/replications` endpoint to create a replication stream.

{{< keep-url >}}
{{< api-endpoint endpoint="localhost:8086/api/v2/remotes" method="POST" api-ref="/influxdb/version/api/#operation/PostRemoteConnection" >}}

Include the following parameters in your request:

- **Headers:**
  - **Authorization:** `Token` scheme with your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS [API token](/influxdb/version/admin/tokens/)
  - **Content-type:** `application/json`
{{% show-in "v2" %}}
- **Request body:** JSON object with the following fields:
  {{< req type="key" >}}
  - **dropNonRetryableData:** Drop data when a non-retryable error is encountered.
  - {{< req "\*" >}} **localBucketID:** Local InfluxDB OSS bucket ID to replicate writes from.
  - {{< req "\*" >}} **maxAgeSeconds:** Maximum age of data in seconds before it is dropped (default is `604800`, must be greater than or equal to `0`).
  - {{< req "\*" >}} **maxQueueSizeBytes:** Maximum replication queue size in bytes (default is `67108860`, must be greater than or equal to `33554430`).
  - {{< req "\*" >}} **name:** Replication stream name.
  - {{< req "\*" >}} **orgID:** Local InfluxDB OSS organization ID.
  - {{< req "\*" >}} **remoteBucketID:** Remote bucket ID to replicate writes to.
  - {{< req "\*" >}} **remoteBucketName:** Remote bucket name to replicate writes to. If replicating to **InfluxDB Enterprise v1**, use the `db-name/rp-name` bucket name syntax.
{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}
- **Request body:** JSON object with the following fields:
  {{< req type="key" >}}
  - **dropNonRetryableData:** Drop data when a non-retryable error is encountered
  - {{< req "\*" >}} **localBucketID:** InfluxDB OSS bucket ID to replicate writes from
  - {{< req "\*" >}} **maxAgeSeconds:** Maximum age of data in seconds before it is dropped (default is `604800`, must be greater than or equal to `0`)
  - {{< req "\*" >}} **maxQueueSizeBytes:** Maximum replication queue size in bytes (default is `67108860`, must be greater than or equal to `33554430`)
  - {{< req "\*" >}} **name:** Replication stream name
  - {{< req "\*" >}} **orgID:** InfluxDB OSS organization ID
  - {{< req "\*" >}} **remoteBucketID:** InfluxDB Cloud bucket ID to replicate writes to (mutually exclusive with `remoteBucketName`)
  - {{< req "\*" >}} **remoteBucketName:** InfluxDB Cloud bucket name to replicate writes to (mutually exclusive with `remoteBucketID`)
  - {{< req "\*" >}} **remoteID:** Remote connection ID
{{% /show-in %}}

> [!Note]
> `remoteBucketID` and `remoteBucketName` are mutually exclusive.
> {{% show-in "v2" %}}If replicating to **InfluxDB Enterprise v1**, use `remoteBucketName` with the `db-name/rp-name` bucket name syntax.{{% /show-in %}}

{{< keep-url >}}
```sh
curl --request POST http://localhost:8086/api/v2/replications \
  --header 'Authorization: Token INFLUX_OSS_TOKEN' \
  --data '{
    "dropNonRetryableData": false,
    "localBucketID": "INFLUX_OSS_BUCKET_ID",
    "maxAgeSeconds": 604800,
    "maxQueueSizeBytes": 67108860,
    "name": "Example replication stream name",
    "orgID": "INFLUX_OSS_ORG_ID",
    "remoteBucketName": "REMOTE_INFLUX_BUCKET_NAME",
    "remoteID": "REMOTE_ID",
  }'
```

After you create a replication stream, InfluxDB {{% show-in "v2" %}}OSS{{% /show-in %}}
replicates all writes from the specified local bucket to the {{% show-in "v2" %}}remote {{% /show-in %}}
InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud {{% /show-in %}}bucket.
To get
information such as the current queue size, max queue size, and latest status
code for each replication stream, send a `GET` request to your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB  OSS `/api/v2/replications` endpoint:

{{< keep-url >}}
{{< api-endpoint endpoint="localhost:8086/api/v2/replications" method="GET" api-ref="/influxdb/version/api/#operation/GetReplications" >}}

Include the following parameters in your request:

- **Headers:**
  - **Authorization:** `Token` scheme with your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS [API token](/influxdb/version/admin/tokens/)
- **Query parameters:**
  - **orgID:** {{% show-in "v2" %}}Local{{% /show-in %}} InfluxDB OSS organization ID

{{< keep-url >}}
```sh
curl --request GET \
  http://localhost:8086/api/v2/replications?orgID=INFLUX_OSS_ORG_ID \
  --header 'Authorization: Token INFLUX_OSS_TOKEN' \
```

<!---------------------------------- END API ---------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% note %}}
#### Important things to note

- Only write operations are replicated. Other data operations (like deletes or restores) are not replicated.
- In InfluxDB OSS, large write request bodies are written entirely.
  When replicated, write requests are sent to the remote bucket in batches.
  The maximum batch size is 500 kB (typically between 250 to 500 lines of line protocol).
  This may result in scenarios where some batches succeed and others fail.
{{% /note %}}

## Replicate downsampled or processed data
In some cases, you may not want to write raw, high-precision data to a remote InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud {{% /show-in %}} instance. To replicate only downsampled or processed data:

1. Create a bucket in your InfluxDB OSS instance to store downsampled or processed data in.
2. Create an InfluxDB task that downsamples or processes data and stores it in the new bucket. For example:

    ```js
    import "influxdata/influxdb/tasks"
    import "types"

    // omit this line if adding task via the UI
    option task = {name: "Downsample raw data", every: 10m}

    data = () => from(bucket: "example-bucket")
        |> range(start: tasks.lastSuccess(orTime: -task.every))

    numeric = data()
        |> filter(fn: (r) => types.isType(v: r._value, type: "float") or types.isType(v: r._value, type: "int") or types.isType(v: r._value, type: "uint"))
        |> aggregateWindow(every: task.every, fn: mean)

    nonNumeric = data()
        |> filter(fn: (r) => types.isType(v: r._value, type: "string") or types.isType(v: r._value, type: "bool"))
        |> aggregateWindow(every: task.every, fn: last)

    union(tables: [numeric, nonNumeric])
        |> to(bucket: "example-downsampled-bucket")
    ```

3. [Create a replication stream](#configure-a-replication-stream) to replicate data from the downsampled bucket to the remote InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud {{% /show-in %}}instance.

## View InfluxDB OSS replication service metrics

In addition to replication stream information that you can access using the [CLI](?t=CLI#configure-a-replication-stream) or [API](?t=API#configure-a-replication-stream), you can view replication service-level metrics for your InfluxDB OSS instance, such as `/api/v2/write` error details, the number and duration of calls to the service, and the total number of points queued.

To view replication service-level metrics send a `GET` request to your local InfluxDB  OSS `/metrics` endpoint.

For more information, see [InfluxDB OSS metrics](/influxdb/version/reference/internals/metrics/).
