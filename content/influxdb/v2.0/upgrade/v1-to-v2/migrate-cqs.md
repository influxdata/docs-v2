---
title: Migrate continuous queries from InfluxDB 1.x to 2.0
description: >
  Upgrade from InfluxDB 1.x to InfluxDB 2.0.
menu:
  influxdb_2_0:
    parent: InfluxDB 1.x to 2.0
    name: Migrate CQs
weight: 101
---

InfluxDB OSS 2.0 replaces 1.x continuous queries (CQs) with **InfluxDB tasks**.
To migrate continuous queries to InfluxDB 2.0, convert InfluxDB 1.x CQs into Flux and create new
InfluxDB 2.0 tasks.

1. [Output all InfluxDB 1.x continuous queries](#output-all-influxdb-1x-continuous-queries)
2. [Convert continuous queries to Flux queries](#convert-continuous-queries-to-flux-queries)
3. [Create new InfluxDB tasks](#create-new-influxdb-tasks)

## Output all InfluxDB 1.x continuous queries

To output and save all continuous queries that exist in your InfluxDB 1.x instance:

1. Use the InfluxDB 1.x `influx` interactive shell to run `show continuous queries`:

    {{< keep-url >}}
    ```sh
    $ influx
    Connected to http://localhost:8086 version 1.8.3
    InfluxDB shell version: 1.8.3
    > show continuous queries
    ```

2. Copy and save all output continuous queries to your local machine.

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

##### Equivalent Flux query
```js
from(bucket: "my-db/")
  |> range(start: -1d)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> filter(fn: (r) => r._field == "example-field")
  |> aggregateWindow(every: 1h, fn: mean)
  |> to(
    org: "example-org",
    bucket: "my-db/downsampled-daily"
  )
```

### influx transpile command
The InfluxDB 2.0 [`influx transpile`](/influxdb/v2.0/reference/cli/influx/transpile/)
command transpiles InfluxQL into Flux and can be useful when converting continuous
queries into Flux tasks.

{{% note %}}
The InfluxQL to Flux transpiler is in active development and is considered experimental.
Transpiled queries may not be optimized for performance and may not fully replicate
the behavior of the provided InfluxQL query.
{{% /note %}}

#### Modify your continuous query to work with the transpiler
To transpile a continuous query to Flux, you must modify the InfluxQL:

1. Move the database and retention policy into the `FROM` clause.
2. Remove the continuous query-specific statements and clauses (`CREATE CONTINUOUS QUERY`, `ON`, `BEGIN`, `END`)
3. Remove `INTO` clauses. The Flux transpiler only supports read operations,
   but writing to InfluxDB 2.0 is achieved with the Flux [`to()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/outputs/to/),
   which you should add after you transpile the query.

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

##### Modified to work with the influx transpile command
```sql
SELECT mean("example-field")
FROM "my-db".."example-measurement"
GROUP BY time(1h)
```

#### Transpile the modified query
Use the `influx transpile` command to transpile your modified InfluxQL into Flux.

```sh
influx transpile '
  SELECT mean("exampleField")
  FROM "mydb".."exampleMeasurement"
  GROUP BY time(1h)
'
```

## Create new InfluxDB tasks
After converting your continuous query to Flux, use the Flux query to
[create a new task](/influxdb/v2.0/process-data/manage-tasks/create-task/).

## Other helpful resources
The following resources are also available to help convert InfluxQL queries to Flux.

##### Documentation
- [Get started with Flux](/influxdb/v2.0/query-data/get-started/)
- [Common tasks](/influxdb/v2.0/process-data/common-tasks/#downsample-data-with-influxdb)

##### Community
- Post in the [InfluxData Community](https://community.influxdata.com/)
- Ask in the [InfluxDB Community Slack](https://influxdata.com/slack)