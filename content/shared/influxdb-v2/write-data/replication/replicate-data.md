
Use InfluxDB replication streams (InfluxDB Edge Data Replication) to replicate
the incoming data of select buckets to one or more buckets on a remote 
InfluxDB OSS, InfluxDB Cloud, or InfluxDB Enterprise instance.

Replicate data from InfluxDB OSS to InfluxDB Cloud, InfluxDB OSS, or InfluxDB Enterprise.

- [Configure a replication stream](#configure-a-replication-stream)
- [Replicate downsampled or processed data](#replicate-downsampled-or-processed-data)
{{% show-in "v2" %}}
- [View replication service metrics](#view-influxdb-oss-replication-service-metrics)
{{% /show-in %}}

## Configure a replication stream

Use the [`influx` CLI](/influxdb/version/tools/influx-cli/) or the
[InfluxDB {{< current-version >}} API](/influxdb/version/reference/api/) to configure
a replication stream.

{{% note %}}
To replicate data to InfluxDB OSS or InfluxDB Enterprise, adjust the
remote connection values accordingly.
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
{{% tab-content %}}

<!--------------------------------- BEGIN CLI --------------------------------->

1. In your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS instance, use
    the `influx remote create` command to create a remote connection to replicate data to.

    **Provide the following:**   

    - Remote connection name    
    {{% show-in "v2" %}}- Remote InfluxDB instance URL{{% /show-in %}}
    {{% show-in "v2" %}}- Remote InfluxDB API token _(API token must have write access to the target bucket)_{{% /show-in %}}
    {{% show-in "v2" %}}- Remote InfluxDB organization ID{{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}- [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/){{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}- InfluxDB Cloud API token _(API token must have write access to the target bucket)_{{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}- InfluxDB Cloud organization ID{{% /show-in %}}

    ```sh
    influx remote create \
      --name example-remote-name \
      --remote-url https://cloud2.influxdata.com \
      --remote-api-token mYsuP3r5Ecr37t0k3n \
      --remote-org-id 00xoXXoxXX00
    ```

    If you already have remote InfluxDB connections configured, you can use an existing connection. To view existing connections, run `influx remote list`.

2. In your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS instance, use the
    `influx replication create` command to create a replication stream.
    
    **Provide the following:**    

    - Replication stream name
    {{% show-in "v2" %}}- Remote connection ID{{% /show-in %}}
    {{% show-in "v2" %}}- Local bucket ID to replicate writes from{{% /show-in %}}
    {{% show-in "v2" %}}- Remote bucket name or ID to replicate writes to. If replicating to **InfluxDB Enterprise**, use the `db-name/rp-name` bucket name syntax.{{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}- Remote connection ID{{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}- InfluxDB OSS bucket ID to replicate writes from{{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}- InfluxDB Cloud bucket ID to replicate writes to{{% /show-in %}}


    ```sh
    influx replication create \
      --name REPLICATION_STREAM_NAME \
      --remote-id REPLICATION_REMOTE_ID \
      --local-bucket-id INFLUX_BUCKET_ID \
      --remote-bucket REMOTE_INFLUX_BUCKET_NAME
    ```

Once a replication stream is created, InfluxDB {{% show-in "v2" %}}OSS{{% /show-in %}}
will replicate all writes to the specified bucket to the {{% show-in "v2" %}}remote {{% /show-in %}}
InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud {{% /show-in %}}bucket.
Use the `influx replication list` command to view information such as the current queue size,
max queue size, and latest status code.

<!---------------------------------- END CLI ---------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------------- BEGIN API --------------------------------->

1.  Send a `POST` request to your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS  `/api/v2/remotes` endpoint to create a remote connection to replicate data to.

    {{< keep-url >}}
    {{< api-endpoint endpoint="localhost:8086/api/v2/remotes" method="POST" api-ref="/influxdb/version/api/#operation/PostRemoteConnection" >}}

    Include the following in your request:  

    - **Request method:** `POST`
    - **Headers:**
      - **Authorization:** `Token` scheme with your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS [API token](/influxdb/version/admin/tokens/)
      - **Content-type:** `application/json`
    - **Request body:** JSON object with the following fields:  
      {{< req type="key" >}}
      - {{< req "\*" >}} **allowInsecureTLS:** All insecure TLS connections
      - **description:** Remote description
      - {{< req "\*" >}} **name:** Remote connection name
      - {{< req "\*" >}} **orgID:** {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS organization ID
      {{% show-in "v2" %}}- {{< req "\*" >}} **remoteAPIToken:** Remote InfluxDB API token _(API token must have write access to the target bucket)_{{% /show-in %}}
      {{% show-in "v2" %}}- {{< req "\*" >}} **remoteOrgID:** Remote InfluxDB organization ID{{% /show-in %}}
      {{% show-in "v2" %}}- {{< req "\*" >}} **remoteURL:** Remote InfluxDB instance URL{{% /show-in %}}
      {{% show-in "cloud,cloud-serverless" %}}- {{< req "\*" >}} **remoteAPIToken:** InfluxDB Cloud API token _(API token must have write access to the target bucket)_{{% /show-in %}}
      {{% show-in "cloud,cloud-serverless" %}}- {{< req "\*" >}} **remoteOrgID:** InfluxDB Cloud organization ID{{% /show-in %}}
      {{% show-in "cloud,cloud-serverless" %}}- {{< req "\*" >}} **remoteURL:** [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/){{% /show-in %}}

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

    If you already have remote InfluxDB connections configured, you can use an
    existing connection. To view existing connections, use the `/api/v2/remotes`
    endpoint with the `GET` request method.

    {{< keep-url >}}
    {{< api-endpoint endpoint="localhost:8086/api/v2/remotes" method="GET" api-ref="/influxdb/version/api/#operation/GetRemoteConnections" >}}

    Include the following in your request:

    - **Request method:** `GET`
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

2.  Send a `POST` request to your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS 
    `/api/v2/replications` endpoint to create a replication stream.

    {{< keep-url >}}
    {{< api-endpoint endpoint="localhost:8086/api/v2/remotes" method="POST" api-ref="/influxdb/version/api/#operation/PostRemoteConnection" >}}
    
    Include the following in your request:

    - **Request method:** `POST`
    - **Headers:**
      - **Authorization:** `Token` scheme with your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB OSS [API token](/influxdb/version/admin/tokens/)
      - **Content-type:** `application/json`
    - **Request body:** JSON object with the following fields:
      {{< req type="key" >}}
      - **dropNonRetryableData:** Drop data when a non-retryable error is encountered.
      - {{< req "\*" >}} **localBucketID:** {{% show-in "v2" %}}Local{{% /show-in %}} InfluxDB OSS bucket ID to replicate writes from.
      - {{< req "\*" >}} **maxAgeSeconds:** Maximum age of data in seconds before it is dropped (default is `604800`, must be greater than or equal to `0`).
      - {{< req "\*" >}} **maxQueueSizeBytes:** Maximum replication queue size in bytes (default is `67108860`, must be greater than or equal to `33554430`).
      - {{< req "\*" >}} **name:** Replication stream name.
      - {{< req "\*" >}} **orgID:** {{% show-in "v2" %}}Local{{% /show-in %}} InfluxDB OSS organization ID.
      {{% show-in "v2" %}}- {{< req "\*" >}} **remoteBucketID:** Remote bucket ID to replicate writes to.{{% /show-in %}}
      {{% show-in "v2" %}}- {{< req "\*" >}} **remoteBucketName:** Remote bucket name to replicate writes to. If replicating to **InfluxDB Enterprise**, use the `db-name/rp-name` bucket name syntax.{{% /show-in %}}
      {{% show-in "cloud,cloud-serverless" %}}- {{< req "\*" >}} **remoteBucketID:** InfluxDB Cloud bucket ID to replicate writes to.{{% /show-in %}}
      {{% show-in "cloud,cloud-serverless" %}}- {{< req "\*" >}} **remoteBucketName:** InfluxDB Cloud bucket name to replicate writes to.{{% /show-in %}}
      - {{< req "\*" >}} **remoteID:** Remote connection ID

    {{% note %}}
`remoteBucketID` and `remoteBucketName` are mutually exclusive.
{{% show-in "v2" %}}If replicating to **InfluxDB Enterprise**, use `remoteBucketName` with the `db-name/rp-name` bucket name syntax.{{% /show-in %}}
    {{% /note %}}

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

Once a replication stream is created, InfluxDB {{% show-in "v2" %}}OSS{{% /show-in %}}
will replicate all writes from the specified local bucket to the {{% show-in "v2" %}}remote {{% /show-in %}}
InfluxDB {{% show-in "cloud,cloud-serverless" %}}Cloud {{% /show-in %}}bucket.
To get
information such as the current queue size, max queue size, and latest status
code for each replication stream, send a `GET` request to your {{% show-in "v2" %}}local{{% /show-in %}} InfluxDB  OSS `/api/v2/replications` endpoint.

{{< keep-url >}}
{{< api-endpoint endpoint="localhost:8086/api/v2/replications" method="GET" api-ref="/influxdb/version/api/#operation/GetReplications" >}}

Include the following in your request:

- **Request method:** `GET`
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
