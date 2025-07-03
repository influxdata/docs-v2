
To migrate data from InfluxDB Cloud to InfluxDB OSS, query the data
from InfluxDB Cloud and write the data to InfluxDB OSS.
Because full data migrations will likely exceed your organization's limits and
adjustable quotas, migrate your data in batches.

The following guide provides instructions for setting up an InfluxDB OSS task
that queries data from an InfluxDB Cloud bucket in time-based batches and writes
each batch to an InfluxDB OSS bucket.

> [!Important]
> All queries against data in InfluxDB Cloud are subject to your organization's
> [rate limits and adjustable quotas](/influxdb/cloud/account-management/limits/).

- [Set up the migration](#set-up-the-migration)
- [Migration task](#migration-task)
  - [Configure the migration](#configure-the-migration)
  - [Migration Flux script](#migration-flux-script)
  - [Configuration help](#configuration-help)
- [Monitor the migration progress](#monitor-the-migration-progress)
- [Troubleshoot migration task failures](#troubleshoot-migration-task-failures)

## Set up the migration

1.  [Install and set up InfluxDB OSS](/influxdb/v2/install/).

2.  **In InfluxDB Cloud**, [create an API token](/influxdb/cloud/admin/tokens/create-token/)
        with **read access** to the bucket you want to migrate.

3.  **In InfluxDB OSS**:
    1.  Add your **InfluxDB Cloud API token** as a secret using the key,
        `INFLUXDB_CLOUD_TOKEN`.
        _See [Add secrets](/influxdb/version/security/secrets/add/) for more information._
    2.  [Create a bucket](/influxdb/version/organizations/buckets/create-bucket/)
        **to migrate data to**.
    3.  [Create a bucket](/influxdb/version/organizations/buckets/create-bucket/)
        **to store temporary migration metadata**.
    4.  [Create a new task](/influxdb/version/process-data/manage-tasks/create-task/)
        using the provided [migration task](#migration-task).
        Update the necessary [migration configuration options](#configure-the-migration).
    5.  _(Optional)_ Set up [migration monitoring](#monitor-the-migration-progress).
    6.  Save the task.

        {{% note %}}
Newly-created tasks are enabled by default, so the data migration begins when you save the task.
        {{% /note %}}

**After the migration is complete**, each subsequent migration task execution
will fail with the following error:

```
error exhausting result iterator: error calling function "die" @41:9-41:86:
Batch range is beyond the migration range. Migration is complete.
```

## Migration task

### Configure the migration

1.  Specify how often you want the task to run using the `task.every` option.
    _See [Determine your task interval](#determine-your-task-interval)._

2.  Define the following properties in the `migration`
    [record](/flux/v0/data-types/composite/record/):

    ##### migration
    - **start**: Earliest time to include in the migration.
      _See [Determine your migration start time](#determine-your-migration-start-time)._
    - **stop**: Latest time to include in the migration.
    - **batchInterval**: Duration of each time-based batch.
      _See [Determine your batch interval](#determine-your-batch-interval)._
    - **batchBucket**: InfluxDB OSS bucket to store migration batch metadata in.
    - **sourceHost**: [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions)
      to migrate data from.
    - **sourceOrg**: InfluxDB Cloud organization to migrate data from.
    - **sourceToken**: InfluxDB Cloud API token. To keep the API token secure, store
      it as a secret in InfluxDB OSS.
    - **sourceBucket**: InfluxDB Cloud bucket to migrate data from.
    - **destinationBucket**: InfluxDB OSS bucket to migrate data to.

### Migration Flux script

```js
import "array"
import "experimental"
import "influxdata/influxdb/secrets"

// Configure the task
option task = {every: 5m, name: "Migrate data from InfluxDB Cloud"}

// Configure the migration
migration = {
    start: 2022-01-01T00:00:00Z,
    stop: 2022-02-01T00:00:00Z,
    batchInterval: 1h,
    batchBucket: "migration",
    sourceHost: "https://cloud2.influxdata.com",
    sourceOrg: "example-cloud-org",
    sourceToken: secrets.get(key: "INFLUXDB_CLOUD_TOKEN"),
    sourceBucket: "example-cloud-bucket",
    destinationBucket: "example-oss-bucket",
}

// batchRange dynamically returns a record with start and stop properties for
// the current batch. It queries migration metadata stored in the
// `migration.batchBucket` to determine the stop time of the previous batch.
// It uses the previous stop time as the new start time for the current batch
// and adds the `migration.batchInterval` to determine the current batch stop time.
batchRange = () => {
    _lastBatchStop =
        (from(bucket: migration.batchBucket)
            |> range(start: migration.start)
            |> filter(fn: (r) => r._field == "batch_stop")
            |> filter(fn: (r) => r.srcOrg == migration.sourceOrg)
            |> filter(fn: (r) => r.srcBucket == migration.sourceBucket)
            |> last()
            |> findRecord(fn: (key) => true, idx: 0))._value
    _batchStart =
        if exists _lastBatchStop then
            time(v: _lastBatchStop)
        else
            migration.start

    return {start: _batchStart, stop: experimental.addDuration(d: migration.batchInterval, to: _batchStart)}
}

// Define a static record with batch start and stop time properties
batch = {start: batchRange().start, stop: batchRange().stop}

// Check to see if the current batch start time is beyond the migration.stop
// time and exit with an error if it is.
finished =
    if batch.start >= migration.stop then
        die(msg: "Batch range is beyond the migration range. Migration is complete.")
    else
        "Migration in progress"

// Query all data from the specified source bucket within the batch-defined time
// range. To limit migrated data by measurement, tag, or field, add a `filter()`
// function after `range()` with the appropriate predicate fn.
data = () =>
    from(host: migration.sourceHost, org: migration.sourceOrg, token: migration.sourceToken, bucket: migration.sourceBucket)
        |> range(start: batch.start, stop: batch.stop)

// rowCount is a stream of tables that contains the number of rows returned in
// the batch and is used to generate batch metadata.
rowCount =
    data()
        |> count()
        |> group(columns: ["_start", "_stop"])
        |> sum()

// emptyRange is a stream of tables that acts as filler data if the batch is
// empty. This is used to generate batch metadata for empty batches and is
// necessary to correctly increment the time range for the next batch.
emptyRange = array.from(rows: [{_start: batch.start, _stop: batch.stop, _value: 0}])

// metadata returns a stream of tables representing batch metadata.
metadata = () => {
    _input =
        if exists (rowCount |> findRecord(fn: (key) => true, idx: 0))._value then
            rowCount
        else
            emptyRange

    return
        _input
            |> map(
                fn: (r) =>
                    ({
                        _time: now(),
                        _measurement: "batches",
                        srcOrg: migration.sourceOrg,
                        srcBucket: migration.sourceBucket,
                        dstBucket: migration.destinationBucket,
                        batch_start: string(v: batch.start),
                        batch_stop: string(v: batch.stop),
                        rows: r._value,
                        percent_complete:
                            float(v: int(v: r._stop) - int(v: migration.start)) / float(
                                    v: int(v: migration.stop) - int(v: migration.start),
                                ) * 100.0,
                    }),
            )
            |> group(columns: ["_measurement", "srcOrg", "srcBucket", "dstBucket"])
}

// Write the queried data to the specified InfluxDB OSS bucket.
data()
    |> to(bucket: migration.destinationBucket)

// Generate and store batch metadata in the migration.batchBucket.
metadata()
    |> experimental.to(bucket: migration.batchBucket)
```

### Configuration help

{{< expand-wrapper >}}

<!----------------------- BEGIN Determine task interval ----------------------->
{{% expand "Determine your task interval" %}}

The task interval determines how often the migration task runs and is defined by
the [`task.every` option](/influxdb/version/process-data/task-options/#every).
InfluxDB Cloud rate limits and quotas reset every five minutes, so
**we recommend a `5m` task interval**.

You can do shorter task intervals and execute the migration task more often,
but you need to balance the task interval with your [batch interval](#determine-your-batch-interval) 
and the amount of data returned in each batch.
If the total amount of data queried in each five-minute interval exceeds your
InfluxDB Cloud organization's [rate limits and quotas](/influxdb/cloud/account-management/limits/),
the batch will fail until rate limits and quotas reset.

{{% /expand %}}
<!------------------------ END Determine task interval ------------------------>

<!---------------------- BEGIN Determine migration start ---------------------->
{{% expand "Determine your migration start time" %}}

The `migration.start` time should be at or near the same time as the earliest
data point you want to migrate.
All migration batches are determined using the `migration.start` time and
`migration.batchInterval` settings.

To find time of the earliest point in your bucket, run the following query:

```js
from(bucket: "example-cloud-bucket")
    |> range(start: 0)
    |> group()
    |> first()
    |> keep(columns: ["_time"])
```

{{% /expand %}}
<!----------------------- END Determine migration start ----------------------->

<!----------------------- BEGIN Determine batch interval ---------------------->
{{% expand "Determine your batch interval" %}}

The `migration.batchInterval` setting controls the time range queried by each batch.
The "density" of the data in your InfluxDB Cloud bucket and your InfluxDB Cloud
organization's [rate limits and quotas](/influxdb/cloud/account-management/limits/)
determine what your batch interval should be.

For example, if you're migrating data collected from hundreds of sensors with
points recorded every second, your batch interval will need to be shorter.
If you're migrating data collected from five sensors with points recorded every
minute, your batch interval can be longer.
It all depends on how much data gets returned in a single batch.

If points occur at regular intervals, you can get a fairly accurate estimate of
how much data will be returned in a given time range by using the `/api/v2/query`
endpoint to execute a query for the time range duration and then measuring the
size of the response body.

The following `curl` command queries an InfluxDB Cloud bucket for the last day
and returns the size of the response body in bytes.
You can customize the range duration to match your specific use case and
data density.

```sh
INFLUXDB_CLOUD_ORG=<your_influxdb_cloud_org>
INFLUXDB_CLOUD_TOKEN=<your_influxdb_cloud_token>
INFLUXDB_CLOUD_BUCKET=<your_influxdb_cloud_bucket>

curl -so /dev/null --request POST \
  https://cloud2.influxdata.com/api/v2/query?org=$INFLUXDB_CLOUD_ORG  \
  --header "Authorization: Token $INFLUXDB_CLOUD_TOKEN" \
  --header "Accept: application/csv" \
  --header "Content-type: application/vnd.flux" \
  --data "from(bucket:\"$INFLUXDB_CLOUD_BUCKET\") |> range(start: -1d, stop: now())" \
  --write-out '%{size_download}'
```

{{% note %}}
You can also use other HTTP API tools like [Postman](https://www.postman.com/)
that provide the size of the response body.
{{% /note %}}

Divide the output of this command by 1000000 to convert it to megabytes (MB).

```
batchInterval = (read-rate-limit-mb / response-body-size-mb) * range-duration
```

For example, if the response body of your query that returns data from one day 
is 8 MB and you're using the InfluxDB Cloud Free Plan with a read limit of
300 MB per five minutes:

```js
batchInterval = (300 / 8) * 1d
// batchInterval = 37d
```

You could query 37 days of data before hitting your read limit, but this is just an estimate.
We recommend setting the `batchInterval` slightly lower than the calculated interval
to allow for variation between batches.
So in this example, **it would be best to set your `batchInterval` to `35d`**.

##### Important things to note

- This assumes no other queries are running in your InfluxDB Cloud organization.
- You should also consider your network speeds and whether a batch can be fully
  downloaded within the [task interval](#determine-your-task-interval).

{{% /expand %}}
<!------------------------ END Determine batch interval ----------------------->
{{< /expand-wrapper >}}

## Monitor the migration progress

The [InfluxDB Cloud Migration Community template](https://github.com/influxdata/community-templates/tree/master/influxdb-cloud-oss-migration/)
installs the migration task outlined in this guide as well as a dashboard
for monitoring running data migrations.

{{< img-hd src="/img/influxdb/2-1-migration-dashboard.png" alt="InfluxDB Cloud migration dashboard" />}}

<a class="btn" href="https://github.com/influxdata/community-templates/tree/master/influxdb-cloud-oss-migration/#quick-install">Install the InfluxDB Cloud Migration template</a>

## Troubleshoot migration task failures

If the migration task fails, [view your task logs](/influxdb/version/process-data/manage-tasks/task-run-history/)
to identify the specific error. Below are common causes of migration task failures.

- [Exceeded rate limits](#exceeded-rate-limits)
- [Invalid API token](#invalid-api-token)
- [Query timeout](#query-timeout)
- [Batch size is too large](#batch-size-is-too-large)

### Exceeded rate limits

If your data migration causes you to exceed your InfluxDB Cloud organization's
limits and quotas, the task will return an error similar to:

```
too many requests
```

**Possible solutions**:
- Update the `migration.batchInterval` setting in your migration task to use
  a smaller interval. Each batch will then query less data.

### Invalid API token

If the API token you add as the `INFLUXDB_CLOUD_SECRET` doesn't have read access to
your InfluxDB Cloud bucket, the task will return an error similar to:

```
unauthorized access
```

**Possible solutions**:
- Ensure the API token has read access to your InfluxDB Cloud bucket.
- Generate a new InfluxDB Cloud API token with read access to the bucket you
  want to migrate. Then, update the `INFLUXDB_CLOUD_TOKEN` secret in your
  InfluxDB OSS instance with the new token.

### Query timeout

The InfluxDB Cloud query timeout is 90 seconds. If it takes longer than this to
return the data from the batch interval, the query will time out and the
task will fail.

**Possible solutions**:
- Update the `migration.batchInterval` setting in your migration task to use
  a smaller interval. Each batch will then query less data and take less time
  to return results.

### Batch size is too large

If your batch size is too large, the task returns an error similar to the following:

```
internal error: error calling function "metadata" @97:1-97:11: error calling function "findRecord" @67:32-67:69: wrong number of fields
```

**Possible solutions**:
- Update the `migration.batchInterval` setting in your migration task to use
  a smaller interval and retrieve less data per batch.
