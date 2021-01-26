---
title: Migrate continuous queries to tasks
description: >
  InfluxDB OSS 2.0 replaces 1.x continuous queries (CQs) with **InfluxDB tasks**.
  To migrate continuous queries to InfluxDB 2.0, convert InfluxDB 1.x CQs into Flux and create new
  InfluxDB 2.0 tasks.
menu:
  influxdb_2_0:
    parent: InfluxDB 1.x to 2.0
    name: Migrate CQs
weight: 101
---

InfluxDB OSS 2.0 replaces 1.x continuous queries (CQs) with **InfluxDB tasks**.
To migrate continuous queries to InfluxDB 2.0 tasks, do the following:

1. [Output all InfluxDB 1.x continuous queries](#output-all-influxdb-1x-continuous-queries)
2. [Convert continuous queries to Flux queries](#convert-continuous-queries-to-flux-queries)
3. [Create new InfluxDB tasks](#create-new-influxdb-tasks)

## Output all InfluxDB 1.x continuous queries

If using the `influxd upgrade` command, by default, all continuous queries are
output to `~/continuous_queries.txt` during the upgrade process.
To customize the destination path of the continuous queries file,
use the `--continuous-query-export-path` flag with the `influxd upgrade` command.

```sh
influxd upgrade --continuous-query-export-path /path/to/continuous_queries.txt
```

**To manually output continuous queries:**

1. Use the InfluxDB 1.x `influx` interactive shell to run `show continuous queries`:

    {{< keep-url >}}
    ```sh
    $ influx
    Connected to http://localhost:8086 version 1.8.3
    InfluxDB shell version: 1.8.3
    > show continuous queries
    ```

2. Copy and save the displayed continuous queries.

## Convert continuous queries to Flux queries

To migrate InfluxDB 1.x continuous queries to InfluxDB 2.0 tasks, convert the InfluxQL query syntax to Flux.
The majority of continuous queries are simple downsampling queries and can be converted quickly
using the [`aggregateWindow()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/).
For example:

##### Example continuous query
```sql
CREATE CONTINUOUS QUERY "downsample-daily" ON "my-db"
BEGIN
  SELECT mean("example-field")
  INTO "average-example-measurement"
  FROM "example-measurement"
  GROUP BY time(1h)
END
```

##### Equivalent Flux task
```js
options task = {
  name: "downsample-daily",
  every: 1d
}

from(bucket: "my-db/")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> filter(fn: (r) => r._field == "example-field")
  |> aggregateWindow(every: 1h, fn: mean)
  |> set(key: "_measurement", as: "average-example-measurement")
  |> to(
    org: "example-org",
    bucket: "my-db/downsample-daily"
  )
```

### Continuous queries with a RESAMPLE clause

The CQ `RESAMPLE` clause uses data from the last specified duration to calculate a new aggregate point.
To accomplish this same functionality in a Flux task, import the `experimental` package
and use [`experimental.subDuration()`](/influxdb/v2.0/reference/flux/stdlib/experimental/subduration/)
to set the `start` parameter in the `range()` function. For example:

##### Example RESAMPLE continuous query
```sql
CREATE CONTINUOUS QUERY "resample-example" ON "my-db"
RESAMPLE EVERY 1m FOR 30m
BEGIN
  SELECT exponential_moving_average(mean("example-field"), 30)
  INTO "resample-average-example-measurement"
  FROM "example-measurement"
  WHERE region = 'example-region'
  GROUP BY time(1m)
END
```

##### Equivalent Flux query with new start time
```js
import "experimental"

options task = {
  name: "resample-example",
  every: 1m
}

from(bucket: "my-db/")
  |> range(start: experimental.subDuration(d: 30m, from: now()))
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field" and
    r.region == "example-region"
  )
  |> aggregateWindow(every: 1m, fn: mean)
  |> exponentialMovingAverage(n: 30)
  |> to(bucket: "resample-average-example-measurement")
```


## Create new InfluxDB tasks
After converting your continuous query to Flux, use the Flux query to
[create a new task](/influxdb/v2.0/process-data/manage-tasks/create-task/).

## Other helpful resources
The following resources are available and may be helpful when converting
continuous queries to Flux tasks.

##### Documentation
- [Get started with Flux](/influxdb/v2.0/query-data/get-started/)
- [Common tasks](/influxdb/v2.0/process-data/common-tasks/#downsample-data-with-influxdb)

##### Community
- Post in the [InfluxData Community](https://community.influxdata.com/)
- Ask in the [InfluxDB Community Slack](https://influxdata.com/slack)