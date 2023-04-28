---
title: Use Flux and SQL to query data
description: >
  Leverage both the performance of SQL and the flexibility of Flux to query and
  process your time series data.
menu:
  influxdb_cloud_serverless:
    name: Use Flux & SQL
    parent: Query data
weight: 204
related:
  - /influxdb/cloud-serverless/get-started/query/
  - /influxdb/cloud-serverless/query-data/sql/
influxdb/cloud-serverless/tags: [sql, flux, query]
---

InfluxDB Cloud Serverless supports both [Flux](/flux/v0.x/) and
[SQL](/influxdb/cloud-serverless/reference/sql/) query languages.
Flux is a full-featured data scripting language that provides a wide range of
functionality and flexibility. SQL is a proven and performant relational query language.

This guide walks through leveraging the performance of SQL and the flexibility of
Flux when querying your time series data.

{{% note %}}
#### Sample data

The query examples below use the
[Get started sample data](/influxdb/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb).
{{% /note %}}

- [Performance and flexibility](#performance-and-flexibility)
- [What to do in SQL versus Flux?](#what-to-do-in-sql-versus-flux?)
- [Use SQL and Flux together](#use-sql-and-flux-together)
  - [Helper functions for SQL in Flux](#helper-functions-for-sql-in-flux)
  - [SQL results structure](#sql-results-structure)
- [Process SQL results with Flux](#process-sql-results-with-flux)
  - [Group by tags](#group-by-tags)
  - [Rename the `time` column to `_time`](#rename-the-time-column-to-_time)
  - [Unpivot your data](#unpivot-your-data)
  - [Example SQL query with further Flux processing](#example-sql-query-with-further-flux-processing)

## Performance and flexibility

Flux was designed and optimized for the
[TSM data model](/influxdb/v2.6/reference/internals/storage-engine/#time-structured-merge-tree-tsm),
which is fundamentally different from IOx.
Because of this, Flux is less performant when querying an IOx-powered bucket.
However, as a full-featured scripting language, Flux gives you the flexibility
to perform a wide range of data processing operations such as statistical
analysis, alerting, HTTP API interactions, and other operations that aren't
supported in SQL.
By using Flux and SQL together, you can benefit from both the performance of SQL
and the flexibility of Flux.

## What to do in SQL versus Flux?

We recommend doing as much of your query as possible in SQL for the most
performant queries.
Do any further processing in Flux.

For optimal performance, the following chain of Flux functions can and should be
performed in SQL:

{{< flex >}}
{{% flex-content %}}
#### Flux
```js
from(...)
    |> range(...)
    |> filter(...)
    |> aggregateWindow(...)
```
{{% /flex-content %}}

{{% flex-content %}}
#### SQL
```sql
SELECT
  DATE_BIN(...) AS _time,
  avg(...) AS ...,
FROM measurement
WHERE
  time >= ...
  AND time < ...
GROUP BY _time
ORDER BY _time
```
{{% /flex-content %}}
{{< /flex >}}

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
[Perform a basic SQL query](/influxdb/cloud-serverless/query-data/sql/basic-query/)._

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
  DATE_BIN(INTERVAL '2 hours', time, '1970-01-01T00:00:00Z'::TIMESTAMP) AS _time,
  room,
  avg(temp) AS temp,
  avg(hum) AS hum,
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T20:00:00Z'
GROUP BY room, _time
ORDER BY _time
```
{{% /influxdb/custom-timestamps %}}

_For more information about performing aggregate queries with SQL, see
[Aggregate data with SQL](/influxdb/cloud-serverless/query-data/sql/aggregate-select/)._

{{% /expand %}}
{{< /expand-wrapper >}}

## Use SQL and Flux together

To use SQL and Flux together and benefit from the strengths of both query languages,
build a **Flux query** that uses the [`iox.sql()` function](/flux/v0.x/stdlib/experimental/iox/sql/)
to execute a SQL query.
The SQL query should return the base data set for your query.
If this data needs further processing that can't be done in SQL, those operations
can be done with native Flux.

{{% note %}}
#### Supported by any InfluxDB 2.x client

The process below uses the `/api/v2/query` endpoint and can be used to execute
SQL queries against an InfluxDB IOx-powered bucket with an HTTP API request or
with all existing InfluxDB 2.x clients including, but not limited to, the following:

- InfluxDB 2.x client libraries
- Grafana and Grafana Cloud InfluxDB data source
- Flux VS code extensions
- InfluxDB OSS 2.x dashboards
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
{{% /influxdb/custom-timestamps %}}

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
  DATE_BIN(INTERVAL '${iox.sqlInterval(d: windowPeriod)}', time, 0::TIMESTAMP) AS _time,
  room,
  avg(temp) AS temp,
  avg(hum) AS hum
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T20:00:00Z'
GROUP BY room, _time
ORDER BY room, _time
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

{{% /influxdb/custom-timestamps %}}

## Process SQL results with Flux

With your base data set returned from `iox.sql()`, you can further process your
data with Flux to perform actions such as complex data transformations, alerting,
HTTP requests, etc.

{{% note %}}
#### For the best performance, limit SQL results

All data returned by `iox.sql()` is loaded into memory and processed there.
To maximize the overall performance of your Flux query, try to return as little
data as possible from your SQL query.
This can by done by downsampling data in your SQL query or by limiting the
queried time range.
{{% /note %}}

1. [Group by tags](#group-by-tags)
1. [Rename the `time` column to `_time`](#rename-the-time-column-to-_time)
1. [Unpivot your data](#unpivot-your-data)

### Group by tags

The Flux `from()` functions returns results grouped by measurement, tag, and field key
and much of the Flux language is designed around this data model.
Because SQL results are ungrouped, to structure results the way many Flux
functions expect, use [`group()`](/flux/v0.x/stdlib/universe/group/) to group by
all of your queried tag columns.

{{% note %}}
Measurements are not stored as a column in the InfluxDB IOx storage engine and
are not returned by SQL.
{{% /note %}}

The [Get started sample data](#sample-data) only includes one tag: `room`.

```js
import "experimental/iox"

iox.sql(...)
    |> group(columns: ["room"])
```

_`group()` does not guarantee sort order, so you likely need to use
[`sort()`](/flux/v0.x/stdlib/universe/sort/) to re-sort your data time **after**
performing other transformations._

### Rename the `time` column to `_time`

Many Flux functions expect or require a column named `_time` (with a leading underscore).
The IOx storage engine stores each point's timestamp in the `time` column (no leading underscore).
Depending on which Flux functions you use, you may need to rename the `time`
column to `_time`.

Rename the `time` column in your SQL query with an `AS` clause _**(recommended for performance)**_
or in Flux with the [`rename()` function](/flux/v0.x/stdlib/universe/rename/).

{{< code-tabs-wrapper >}}
{{% code-tabs "small" %}}
[SQL](#)
[Flux](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT time AS _time
FROM "get-started"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// ...
    |> rename(columns: {time: "_time"})
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Unpivot your data

In the context of Flux, data is considered "pivoted" when each field has its own
column. Flux generally expects a `_field` column that contains the the field key
and a `_value` column that contains the field. SQL returns each field as a column.
Depending on your use case and the type of processing you need to do in Flux,
you may need to "unpivot" your data.

{{< expand-wrapper >}}
{{% expand "View examples of pivoted and unpivoted data" %}}
{{% influxdb/custom-timestamps %}}

##### Pivoted data (SQL data model)

| _time                | room    | temp |  hum |
| :------------------- | :------ | ---: | ---: |
| 2022-01-01T08:00:00Z | Kitchen |   21 | 35.9 |
| 2022-01-01T09:00:00Z | Kitchen |   23 | 36.2 |
| 2022-01-01T10:00:00Z | Kitchen | 22.7 | 36.1 |

##### Unpivoted data (Flux data model)

| _time                | room    | _field | _value |
| :------------------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | Kitchen | hum    |   35.9 |
| 2022-01-01T09:00:00Z | Kitchen | hum    |   36.2 |
| 2022-01-01T10:00:00Z | Kitchen | hum    |   36.1 |

| _time                | room    | _field | _value |
| :------------------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | Kitchen | temp   |     21 |
| 2022-01-01T09:00:00Z | Kitchen | temp   |     23 |
| 2022-01-01T10:00:00Z | Kitchen | temp   |   22.7 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
#### Unpivoting data may not be necessary

Depending on your use case, unpivoting the SQL results may not be necessary.
For Flux queries that already pivot fields into columns, using SQL to return
pivoted results will greatly improve the performance of your query.
{{% /note %}}

To unpivot SQL results:

1. Import the `experimental` package.
2. [Ensure you have a `_time` column](#rename-the-time-column-to-_time).
3. Use [`experimental.unpivot()`](/flux/v0.x/stdlib/experimental/unpivot/) to unpivot your data.

```js
import "experimental"
import "experimental/iox"

iox.sql(...)
    |> group(columns: ["room"])
    |> experimental.unpivot()
```

{{% note %}}
`unpivot()` treats columns _not_ in the [group key](/flux/v0.x/get-started/data-model/#group-key)
(other than `_time` and `_measurement`) as fields. Be sure to [group by tags](#group-by-tags)
_before_ unpivoting data.
{{% /note %}}

### Example SQL query with further Flux processing

{{% influxdb/custom-timestamps %}}
```js
import "experimental"
import "experimental/iox"

query = "
SELECT
  time AS _time,
  room,
  temp,
  hum,
  co
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z' 
"

iox.sql(bucket: "get-started", query: query)
    |> group(columns: ["room"])
    |> experimental.unpivot()
```
{{% /influxdb/custom-timestamps %}}

{{< expand-wrapper >}}
{{% expand "View processed query results" %}}

{{% influxdb/custom-timestamps %}}

| _time                | room        | _field | _value |
| :------------------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | Kitchen     | co     |      0 |
| 2022-01-01T09:00:00Z | Kitchen     | co     |      0 |
| 2022-01-01T10:00:00Z | Kitchen     | co     |      0 |
| 2022-01-01T11:00:00Z | Kitchen     | co     |      0 |
| 2022-01-01T12:00:00Z | Kitchen     | co     |      0 |
| 2022-01-01T13:00:00Z | Kitchen     | co     |      1 |
| 2022-01-01T14:00:00Z | Kitchen     | co     |      1 |
| 2022-01-01T15:00:00Z | Kitchen     | co     |      3 |
| 2022-01-01T16:00:00Z | Kitchen     | co     |      7 |
| 2022-01-01T17:00:00Z | Kitchen     | co     |      9 |
| 2022-01-01T18:00:00Z | Kitchen     | co     |     18 |
| 2022-01-01T19:00:00Z | Kitchen     | co     |     22 |
| 2022-01-01T20:00:00Z | Kitchen     | co     |     26 |

| _time                | room        | _field | _value |
| :------------------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | Living Room | co     |      0 |
| 2022-01-01T09:00:00Z | Living Room | co     |      0 |
| 2022-01-01T10:00:00Z | Living Room | co     |      0 |
| 2022-01-01T11:00:00Z | Living Room | co     |      0 |
| 2022-01-01T12:00:00Z | Living Room | co     |      0 |
| 2022-01-01T13:00:00Z | Living Room | co     |      0 |
| 2022-01-01T14:00:00Z | Living Room | co     |      0 |
| 2022-01-01T15:00:00Z | Living Room | co     |      1 |
| 2022-01-01T16:00:00Z | Living Room | co     |      4 |
| 2022-01-01T17:00:00Z | Living Room | co     |      5 |
| 2022-01-01T18:00:00Z | Living Room | co     |      9 |
| 2022-01-01T19:00:00Z | Living Room | co     |     14 |
| 2022-01-01T20:00:00Z | Living Room | co     |     17 |

| _time                | room        | _field | _value |
| :------------------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | Kitchen     | hum    |   35.9 |
| 2022-01-01T09:00:00Z | Kitchen     | hum    |   36.2 |
| 2022-01-01T10:00:00Z | Kitchen     | hum    |   36.1 |
| 2022-01-01T11:00:00Z | Kitchen     | hum    |     36 |
| 2022-01-01T12:00:00Z | Kitchen     | hum    |     36 |
| 2022-01-01T13:00:00Z | Kitchen     | hum    |   36.5 |
| 2022-01-01T14:00:00Z | Kitchen     | hum    |   36.3 |
| 2022-01-01T15:00:00Z | Kitchen     | hum    |   36.2 |
| 2022-01-01T16:00:00Z | Kitchen     | hum    |     36 |
| 2022-01-01T17:00:00Z | Kitchen     | hum    |     36 |
| 2022-01-01T18:00:00Z | Kitchen     | hum    |   36.9 |
| 2022-01-01T19:00:00Z | Kitchen     | hum    |   36.6 |
| 2022-01-01T20:00:00Z | Kitchen     | hum    |   36.5 |

| _time                | room        | _field | _value |
| :------------------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | Living Room | hum    |   35.9 |
| 2022-01-01T09:00:00Z | Living Room | hum    |   35.9 |
| 2022-01-01T10:00:00Z | Living Room | hum    |     36 |
| 2022-01-01T11:00:00Z | Living Room | hum    |     36 |
| 2022-01-01T12:00:00Z | Living Room | hum    |   35.9 |
| 2022-01-01T13:00:00Z | Living Room | hum    |     36 |
| 2022-01-01T14:00:00Z | Living Room | hum    |   36.1 |
| 2022-01-01T15:00:00Z | Living Room | hum    |   36.1 |
| 2022-01-01T16:00:00Z | Living Room | hum    |     36 |
| 2022-01-01T17:00:00Z | Living Room | hum    |   35.9 |
| 2022-01-01T18:00:00Z | Living Room | hum    |   36.2 |
| 2022-01-01T19:00:00Z | Living Room | hum    |   36.3 |
| 2022-01-01T20:00:00Z | Living Room | hum    |   36.4 |

| _time                | room        | _field | _value |
| :------------------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | Kitchen     | temp   |     21 |
| 2022-01-01T09:00:00Z | Kitchen     | temp   |     23 |
| 2022-01-01T10:00:00Z | Kitchen     | temp   |   22.7 |
| 2022-01-01T11:00:00Z | Kitchen     | temp   |   22.4 |
| 2022-01-01T12:00:00Z | Kitchen     | temp   |   22.5 |
| 2022-01-01T13:00:00Z | Kitchen     | temp   |   22.8 |
| 2022-01-01T14:00:00Z | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | Kitchen     | temp   |   22.7 |

| _time                | room        | _field | _value |
| :------------------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | Living Room | temp   |   21.1 |
| 2022-01-01T09:00:00Z | Living Room | temp   |   21.4 |
| 2022-01-01T10:00:00Z | Living Room | temp   |   21.8 |
| 2022-01-01T11:00:00Z | Living Room | temp   |   22.2 |
| 2022-01-01T12:00:00Z | Living Room | temp   |   22.2 |
| 2022-01-01T13:00:00Z | Living Room | temp   |   22.4 |
| 2022-01-01T14:00:00Z | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | Living Room | temp   |   22.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

With the SQL results restructured into the Flux data model, you can do any further
processing with Flux. For more information about Flux, see the
[Flux documentation](/flux/v0.x/).
