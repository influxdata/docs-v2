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
weight: 102
related:
  - /influxdb/v2.0/query-data/get-started/
  - /influxdb/v2.0/query-data/flux/
  - /influxdb/v2.0/process-data/
  - /influxdb/v2.0/process-data/common-tasks/
  - /influxdb/v2.0/reference/flux/flux-vs-influxql/
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

1. Use the **InfluxDB 1.x `influx` interactive shell** to run `SHOW CONTINUOUS QUERIES`:

    {{< keep-url >}}
    ```sh
    $ influx
    Connected to http://localhost:8086 version 1.8.5
    InfluxDB shell version: 1.8.5
    > SHOW CONTINUOUS QUERIES
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
  INTO "my-db"."example-rp"."average-example-measurement"
  FROM "example-measurement"
  GROUP BY time(1h)
END
```

##### Equivalent Flux task
```js
option task = {
  name: "downsample-daily",
  every: 1d
}

from(bucket: "my-db/")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> filter(fn: (r) => r._field == "example-field")
  |> aggregateWindow(every: 1h, fn: mean)
  |> set(key: "_measurement", value: "average-example-measurement")
  |> to(
    org: "example-org",
    bucket: "my-db/example-rp"
  )
```

### Convert InfluxQL continuous queries to Flux
Review the following statements and clauses to see how to convert your CQs to Flux:

- [ON clause](#on-clause)
- [SELECT statement](#select-statement)
- [INTO clause](#into-clause)
- [FROM clause](#from-clause)
- [AS clause](#as-clause)
- [WHERE clause](#where-clause)
- [GROUP BY clause](#group-by-clause)
- [RESAMPLE clause](#resample-clause)

#### ON clause
The `ON` clause defines the database to query.
In InfluxDB OSS 2.0, database and retention policy combinations are mapped to specific buckets
(for more information, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)).

Use the [`from()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from)
to specify the bucket to query:

###### InfluxQL
```sql
CREATE CONTINUOUS QUERY "downsample-daily" ON "my-db"
-- ...
```

###### Flux
```js
from(bucket: "my-db/")
// ...
```

#### SELECT statement
The `SELECT` statement queries data by field, tag, and time from a specific measurement.
`SELECT` statements can take many different forms and converting them to Flux depends
on your use case. For information about Flux and InfluxQL function parity, see
[Flux vs InfluxQL](/influxdb/v2.0/reference/flux/flux-vs-influxql/#influxql-and-flux-parity).
See [other resources available to help](#other-helpful-resources).

#### INTO clause
The `INTO` clause defines the measurement to write results to.
`INTO` also supports fully-qualified measurements that include the database and retention policy.
In InfluxDB OSS 2.0, database and retention policy combinations are mapped to specific buckets
(for more information, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)).

To write to a measurement different than the measurement queried, use
[`set()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/) or
[`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/)
to change the measurement name.
Use the `to()` function to specify the bucket to write results to.

###### InfluxQL
```sql
-- ...
INTO "example-db"."example-rp"."example-measurement"
-- ...
```

###### Flux
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[set()](#)
[map()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
// ...
  |> set(key: "_measurement", value: "example-measurement")
  |> to(bucket: "example-db/example-rp")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// ...
  |> map(fn: (r) => ({ r with _measurement: "example-measurement"}))
  |> to(bucket: "example-db/example-rp")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### Write pivoted data to InfluxDB
InfluxDB 1.x query results include a column for each field.
InfluxDB 2.0 does not do this by default, but it is possible with
[`pivot()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot)
or [`schema.fieldsAsCols()`](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/fieldsascols/).

If you use `to()` to write _pivoted data_ back to InfluxDB 2.0, each field column is stored as a tag.
To write pivoted fields back to InfluxDB as fields, import the `experimental` package
and use the [`experimental.to()` function](/influxdb/v2.0/reference/flux/stdlib/experimental/to/).

###### InfluxQL
```sql
CREATE CONTINUOUS QUERY "downsample-daily" ON "my-db"
BEGIN
  SELECT mean("example-field-1"), mean("example-field-2")
  INTO "example-db"."example-rp"."example-measurement"
  FROM "example-measurement"
  GROUP BY time(1h)
END
```

###### Flux
```js
// ...

from(bucket: "my-db/")
  |> range(start: -task.every)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> filter(fn: (r) => r._field == "example-field-1" or r._field == "example-field-2")
  |> aggregateWindow(every: task.every, fn: mean)
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> experimental.to(bucket: "example-db/example-rp")
```

#### FROM clause
The from clause defines the measurement to query.
Use the [`filter()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/)
to specify the measurement to query.

###### InfluxQL
```sql
-- ...
FROM "example-measurement"
-- ...
```

###### Flux
```js
// ...
  |> filter(fn: (r) => r._measurement == "example-measurement")
```

#### AS clause
The `AS` clause changes the name of the field when writing data back to InfluxDB.
Use [`set()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/)
or [`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/)
to change the field name.

###### InfluxQL
```sql
-- ...
AS newfield
-- ...
```

###### Flux
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[set()](#)
[map()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
// ...
  |> set(key: "_field", value: "newfield")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// ...
  |> map(fn: (r) => ({ r with _field: "newfield"}))
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### WHERE clause
The `WHERE` clause uses predicate logic to filter results based on fields, tags, or timestamps.
Use the [`filter()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/)
and Flux [comparison operators](/influxdb/v2.0/reference/flux/language/operators/#comparison-operators)
to filter results based on fields and tags.
Use the [`range()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/range/) to filter results based on timestamps.

###### InfluxQL
```sql
-- ...
WHERE "example-tag" = "foo" AND time > now() - 7d
```

###### Flux
```js
// ...
  |> range(start: -7d)
  |> filter(fn: (r) => r["example-tag"] == "foo")
```

#### GROUP BY clause
The InfluxQL `GROUP BY` clause groups data by specific tags or by time (typically to calculate an aggregate value for windows of time).

##### Group by tags
Use the [`group()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group/)
to modify the [group key](/influxdb/v2.0/reference/glossary/#group-key) and change how data is grouped.

###### InfluxQL
```sql
-- ...
GROUP BY "location"
```

###### Flux
```js
// ...
  |> group(columns: ["location"])
```

##### Group by time
Use the [`aggregateWindow()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/)
to group data into time windows and perform an aggregation on each window.
In CQs, the interval specified in the `GROUP BY time()` clause determines the CQ execution interval.
Use the `GROUP BY time()` interval to set the `every` task option.

###### InfluxQL
```sql
-- ...
SELECT MEAN("example-field")
FROM "example-measurement"
GROUP BY time(1h)
```

###### Flux
```js
option task = {
  name: "task-name",
  every: 1h
}

// ...
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
  |> aggregateWindow(every: task.every, fn: mean)
```

#### RESAMPLE clause

The CQ `RESAMPLE` clause uses data from the last specified duration to calculate a new aggregate point.
The `EVERY` interval in `RESAMPLE` defines how often the CQ runs.
The `FOR` interval defines the total time range queried by the CQ.

To accomplish this same functionality in a Flux task, set the `start` parameter
in the `range()` function to the negative `FOR` duration.
Define the task execution interval in the `task` options.
For example:

###### InfluxQL
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

###### Flux
```js
option task = {
  name: "resample-example",
  every: 1m
}

from(bucket: "my-db/")
  |> range(start: -30m)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field" and
    r.region == "example-region"
  )
  |> aggregateWindow(every: 1m, fn: mean)
  |> exponentialMovingAverage(n: 30)
  |> set(key: "_measurement", value: "resample-average-example-measurement")
  |> to(bucket: "my-db/")
```

## Create new InfluxDB tasks
After converting your continuous query to Flux, use the Flux query to
[create a new task](/influxdb/v2.0/process-data/manage-tasks/create-task/).

## Other helpful resources
The following resources are available and may be helpful when converting
continuous queries to Flux tasks.

##### Documentation
- [Get started with Flux](/influxdb/v2.0/query-data/get-started/)
- [Query data with Flux](/influxdb/v2.0/query-data/flux/)
- [Common tasks](/influxdb/v2.0/process-data/common-tasks/#downsample-data-with-influxdb)

##### Community
- Post in the [InfluxData Community](https://community.influxdata.com/)
- Ask in the [InfluxDB Community Slack](https://influxdata.com/slack)
