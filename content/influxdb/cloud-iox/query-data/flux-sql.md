---
title: Use Flux and SQL to query data
description: >
  Leverage both the performance of SQL and the flexibility of Flux to query and
  process your time series data.
menu:
  influxdb_cloud_iox:
    name: Use Flux & SQL
    parent: Query data
weight: 204
related:
  - /influxdb/cloud-iox/get-started/query/
---

InfluxDB Cloud powered by [InfluxDB IOx](/influxdb/cloud-iox/#the-influxdb-iox-storage-engine)
supports both [Flux](/flux/v0.x/) and [SQL](/influxdb/cloud-iox/reference/sql/) query languages.
Flux is a full-featured data scripting language that provides a wide range of
functionality and flexibility. SQL is a proven and performant relational query language.

This guide walks through leveraging the performance of SQL and the flexibility of
Flux when querying your time series data.

{{% note %}}
#### Sample data

The query examples below use the
[Get started sample data](/influxdb/cloud-iox/get-started/write/#write-line-protocol-to-influxdb).
{{% /note %}}

## Performance and flexibility

When querying an InfluxDB bucket powered by InfluxDB IOx, there are performance
differences between Flux and SQL. Flux was designed and optimized for the
[TSM data model](/influxdb/v2.6/reference/internals/storage-engine/#time-structured-merge-tree-tsm),
which is fundamentally different from IOx.
Because of this, Flux is less performant when querying an IOx-powered bucket.
The IOx on-disk data structure is more compatible with SQL and makes querying
with SQL more performant.

As a full-featured scripting language, Flux gives you the flexibility to perform
a wide range of data processing operations, statistical analysis, alerting,
HTTP API interactions, etc. and other operations that aren't supported SQL.
By using Flux and SQL together, you can benefit from both the performance of SQL
and the flexibility of Flux.

## What to do in SQL versus Flux?

We recommend doing as much of your query as possible in SQL and do any further
processing in Flux. The following chain of Flux functions can be done in SQL:

```js
from() |> range() |> filter() |> aggregateWindow()
```

#### Example Flux versus SQL queries

{{< expand-wrapper >}}
{{% expand "View example basic queries" %}}

{{% influxdb/custom-timestamps %}}
##### Flux
```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:00Z)
    |> filter(fn: (r) => r._measurement == "home")
```

##### SQL
```sql
SELECT *
FROM home
WHERE time >= '2022-01-01T08:00:00Z' AND time < '2022-01-01T20:00:00Z'
```
{{% /influxdb/custom-timestamps %}}

_For more information about performing basic queries with SQL, see
[Perform a basic SQL query](/influxdb/cloud-iox/query-data/sql/basic-query/)._

{{% /expand %}}

{{% expand "View example aggregate queries" %}}

{{% influxdb/custom-timestamps %}}
##### Flux
```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:00Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp" or r._field == "hum")
    |> aggregateWindow(every: 2h, fn: mean)
```

##### SQL
```sql
SELECT
  DATE_BIN(INTERVAL '2 hours', time, '1970-01-01T00:00:00Z'::TIMESTAMP) AS agg_time,
  room,
  avg(temp) AS temp,
  avg(hum) AS hum,
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T20:00:00Z'
GROUP BY room, agg_time
ORDER BY agg_time
```
{{% /influxdb/custom-timestamps %}}

_For more information about performing aggregate queries with SQL, see
[Aggregate data with SQL](/influxdb/cloud-iox/query-data/sql/aggregate-select/)._

{{% /expand %}}
{{< /expand-wrapper >}}

## Use SQL and Flux together

To use SQL and Flux together and benefit from the strengths of both query languages,
build a **Flux query** that uses the [`iox.sql()` function](/flux/v0.x/stdlib/experimental/iox/sql/)
to execute a SQL function.

{{% note %}}
The process below uses the `/api/v2/query` endpoint and can be used to execute
SQL queries against an InfluxDB IOx-powered bucket with all existing
InfluxDB 2.x clients.
{{% /note %}}

1.  Import the [`experimental/iox` package](/flux/v0.x/stdlib/experimental/iox/).
2.  Use [`iox.sql()`](/flux/v0.x/stdlib/experimental/iox/sql/) to execute a SQL
    query. Include the following parameters:

    - **bucket**: InfluxDB bucket to query
    - **query**: SQL query to execute

{{% influxdb/custom-timestamps %}}
```js
import "experimental/iox"

query = "
SELECT *
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T20:00:00Z'
"

iox.sql(bucket: "get-started", query: query)
```
{{% influxdb/custom-timestamps %}}

{{% note %}}
#### Escape double quotes in your SQL query

If your SQL query uses **double-quoted (`""`) identifiers**, you must escape the
double quotes in your SQL query string.

{{< expand-wrapper >}}
{{% expand "View example" %}}
```js
import "experimental/iox"

query = "
SELECT *
FROM \"home\"
WHERE
  \"time\" >= '2022-01-01T08:00:00Z'
  AND \"time\" < '2022-01-01T20:00:00Z'
"

iox.sql(bucket: "get-started", query: query)
```
{{% /expand %}}
{{< /expand-wrapper >}}
{{% /note %}}

### Helper functions for SQL in Flux

The Flux `experimental/iox` package provides the following helper functions for
use with SQL queries in Flux:

- [iox.sqlInterval()](#ioxsqlinterval)

#### iox.sqlInterval()

[`iox.sqlInterval()`](/flux/v0.x/stdlib/experimental/iox/sqlinterval/) converts
a Flux [duration value](/flux/v0.x/data-types/basic/duration/) to a SQL 
interval string. For example, `2d12h` converts to `2 days 12 hours`.
This is especially useful when using a Flux duration to downsample data in SQL.

{{< expand-wrapper >}}
{{% expand "View `iox.sqlInterval()` example" %}}
```js
import "experimental/iox"

windowPeriod = 2h

query = "
SELECT
  DATE_BIN(INTERVAL '${iox.sqlInterval(d: windowPeriod)}', time, 0::TIMESTAMP) AS agg_time,
  room,
  avg(temp) AS temp,
  avg(hum) AS hum
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T20:00:00Z'
GROUP BY room, agg_time
ORDER BY room, agg_time
"

iox.sql(bucket: "get-started", query: query)
```
{{% /expand %}}
{{< /expand-wrapper >}}

### SQL results structure

`iox.sql()` returns a single table containing all the queried data.
Each row has a column for each queried field, tag, and time.
In the context of Flux, SQL results are ungrouped. This is important to understand
if you further process SQL results with Flux.

The [example query above](#use-sql-and-flux-together) returns:

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   0 | 35.9 | Kitchen     |   21 | 2022-01-01T08:00:00Z |
|   0 | 36.2 | Kitchen     |   23 | 2022-01-01T09:00:00Z |
|   0 | 36.1 | Kitchen     | 22.7 | 2022-01-01T10:00:00Z |
|   0 |   36 | Kitchen     | 22.4 | 2022-01-01T11:00:00Z |
|   0 | 35.9 | Living Room | 21.1 | 2022-01-01T08:00:00Z |
|   0 | 35.9 | Living Room | 21.4 | 2022-01-01T09:00:00Z |
|   0 |   36 | Living Room | 21.8 | 2022-01-01T10:00:00Z |
|   0 |   36 | Living Room | 22.2 | 2022-01-01T11:00:00Z |

{{% influxdb/custom-timestamps %}}

## Process SQL results with Flux

---

- Process data returned from the SQL query with native Flux functions.
- Types of operations to run in SQL
  - Base data selection
  - Applying aggregates
  - `from() |> range() |> filter() |> aggregateWindow()`
  - Aggregating data with a Flux duration

    ```js
    import "experimental/iox"

    windowPeriod = 1d

    query = "
    SELECT
      date_bin(INTERVAL '${iox.sqlInterval(d: windowPeriod)}', time, 0::TIMESTAMP) AS _time,
      avg(co),
      avg(temp),
      avg(hum)
    FROM home
    "
    ```

- Processing SQL query results with Flux
  - SQL query output
    - Ungrouped, needs to be grouped by tag
    - For some transformations, you may need to unpivot the data
    - Many Flux functions require a specific column name.
      You may need rename columns.