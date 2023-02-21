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

## General recommendations

- Query the data with SQL. Leverage SQL as much as possible for the most performant
  queries. 
- Process data returned from the SQL query with native Flux functions.

## Query data from the InfluxDB IOx storage engine

To leverage both the performance of SQL and the flexibility of Flux:

Use [`iox.sql()`](/flux/v0.x/stdlib/experimental/iox/sql/) to query your base data set.

SQL queries can replace the `from() |> range() |> filter()` and even `|> aggregateWindow()`
function chains in your Flux queries. For example, I can replace the following
Flux with a SQL query:

{{% note %}}
The following example uses the
[Get started sample data](/influxdb/cloud-iox/get-started/write/#write-line-protocol-to-influxdb).
{{% /note %}}

{{% influxdb/custom-timestamps %}}
```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:00Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp" or r._field == "hum")
```

```sql
SELECT
  time,
  room,
  temp,
  hum
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```
{{% /influxdb/custom-timestamps %}}


#### iox.sql

`iox.sql()`

#### iox.from

```js
import "experimental/iox"

query = "
SELECT
  DATE_BIN(INTERVAL '2 hours', time, '1970-01-01'::TIMESTAMP) AS _time,
  max(co) AS max_co,
  avg(temp) AS avg_temp,
  avg(hum) AS avg_hum
FROM home
GROUP BY _time
ORDER BY _time
"

iox.sql(bucket: "get-started", query: query)
```

- Types of operations to run in SQL
  - Base data selection
  - Applying aggregates
  - `from() |> range() |> filter() |> aggregateWindow()`
  - Aggregating data with a Flux duration
    - iox.sqlInterval() helper function

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