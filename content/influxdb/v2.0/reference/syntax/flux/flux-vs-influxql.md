---
title: Flux vs InfluxQL
description: >
  Flux is an alternative to InfluxQL and other SQL-like query languages for querying and analyzing data.
  Learn about what's possible with Flux and how Flux compares to InfluxQL.
aliases:
  - /influxdb/v2.0/reference/flux/flux-vs-influxql/
menu:
  influxdb_2_0_ref:
    name: Flux vs InfluxQL
    parent: flux-syntax
    weight: 105
---

Flux is an alternative to [InfluxQL](/influxdb/v2.0/query-data/influxql/)
and other SQL-like query languages for querying and analyzing data.
Flux uses functional language patterns that overcome many InfluxQL limitations.
Check out the following distinctions between Flux and InfluxQL:

- [Tasks possible with Flux](#tasks-possible-with-flux)
- [InfluxQL and Flux parity](#influxql-and-flux-parity)

## Tasks possible with Flux

- [Joins](#joins)
- [Math across measurements](#math-across-measurements)
- [Sort by tags](#sort-by-tags)
- [Group by any column](#group-by-any-column)
- [Window by calendar months and years](#window-by-calendar-months-and-years)
- [Work with multiple data sources](#work-with-multiple-data-sources)
- [DatePart-like queries](#datepart-like-queries)
- [Pivot](#pivot)
- [Histograms](#histograms)
- [Covariance](#covariance)
- [Cast booleans to integers](#cast-booleans-to-integers)
- [String manipulation and data shaping](#string-manipulation-and-data-shaping)
- [Work with geo-temporal data](#work-with-geo-temporal-data)

### Joins
InfluxQL has never supported joins. Although you can use a join in a [TICKscript](/{{< latest "kapacitor" >}}/tick/introduction/),
TICKscript's join capabilities are limited.
Flux's [`join()` function](/{{< latest "flux" >}}/stdlib/universe/join/) lets you
join data **from any bucket, any measurement, and on any columns** as long as
each data set includes the columns to join on.

```js
dataStream1 = from(bucket: "example-bucket1")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "network" and
    r._field == "bytes-transferred"
  )

dataStream2 = from(bucket: "example-bucket2")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "httpd" and
    r._field == "requests-per-sec"
    )

join(
    tables: {d1:dataStream1, d2:dataStream2},
    on: ["_time", "_stop", "_start", "host"]
  )
```

_For an in-depth walkthrough of using the `join()` function, see [how to join data with Flux](/influxdb/v2.0/query-data/flux/join/)._

### Math across measurements
Being able to perform joins across measurements lets you calculate
data from separate measurements.
The example below takes data from two measurements, `mem` and `processes`,
joins them, and then calculates the average amount of memory used per running process:

```js
// Memory used (in bytes)
memUsed = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used"
  )

// Total processes running
procTotal = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "processes" and
    r._field == "total"
    )

// Join memory used with total processes to calculate
// the average memory (in MB) used for running processes.
join(
    tables: {mem:memUsed, proc:procTotal},
    on: ["_time", "_stop", "_start", "host"]
  )
  |> map(fn: (r) => ({
    _time: r._time,
    _value: (r._value_mem / r._value_proc) / 1000000
  })
)
```

### Sort by tags
InfluxQL's sorting capabilities only let you control the
sort order of `time` using the `ORDER BY time` clause.
The Flux [`sort()` function](/{{< latest "flux" >}}/stdlib/universe/sort)
sorts records based on a list of columns.
Depending on the column type, Flux sorts records lexicographically, numerically, or chronologically.

```js
from(bucket:"example-bucket")
  |> range(start: -12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

### Group by any column
InfluxQL lets you group by tags or time intervals only.
Flux lets you group data by any column, including `_value`.
Use the Flux [`group()` function](/{{< latest "flux" >}}/stdlib/universe/group/)
to define which columns to group data by.

```js
from(bucket:"example-bucket")
  |> range(start: -12h)
  |> filter(fn: (r) => r._measurement == "system" and r._field == "uptime" )
  |> group(columns:["host", "_value"])
```

### Window by calendar months and years
InfluxQL does not support windowing data by calendar months and years due to their varied lengths.
Flux supports calendar month and year duration units (`1mo`, `1y`) and lets you
window and aggregate data by calendar month and year.

```js
from(bucket:"example-bucket")
  |> range(start:-1y)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  |> aggregateWindow(every: 1mo, fn: mean)
```

### Work with multiple data sources
InfluxQL can only query data stored in InfluxDB.
Flux can query data from other data sources such as CSV, PostgreSQL, MySQL, Google BigTable, and more.
Join that data with data in InfluxDB to enrich query results.

- [Flux CSV package](/{{< latest "flux" >}}/stdlib/csv/)
- [Flux SQL package](/{{< latest "flux" >}}/stdlib/sql/)
- [Flux BigTable package](/{{< latest "flux" >}}/stdlib/experimental/bigtable/)

<!-- -->
```js
import "csv"
import "sql"

csvData = csv.from(csv: rawCSV)
sqlData = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM example_table"
)
data = from(bucket: "example-bucket")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "sensor")

auxData = join(tables: {csv: csvData, sql: sqlData}, on: ["sensor_id"])
enrichedData = join(tables: {data: data, aux: auxData}, on: ["sensor_id"])

enrichedData
  |> yield(name: "enriched_data")
```

_For an in-depth walkthrough of querying SQL data, see [Query SQL data sources](/influxdb/v2.0/query-data/flux/sql/)._

### DatePart-like queries
InfluxQL doesn't support DatePart-like queries that only return results during specified hours of the day.
The Flux [`hourSelection` function](/{{< latest "flux" >}}/stdlib/universe/hourselection/)
returns only data with time values in a specified hour range.

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> hourSelection(start: 9, stop: 17)
```

### Pivot
Pivoting data tables isn't supported in InfluxQL.
Use the Flux [`pivot()` function](/{{< latest "flux" >}}/stdlib/universe/pivot)
to pivot data tables by `rowKey`, `columnKey`, and `valueColumn` parameters.

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_field"],
    valueColumn: "_value"
  )
```

### Histograms
Generating histograms isn't supported in InfluxQL.
Use the Flux [`histogram()` function](/{{< latest "flux" >}}/stdlib/universe/histogram) to
generate a cumulative histogram.

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> histogram(
    buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  )
```

_For more examples, see [how to create histograms with Flux](/influxdb/v2.0/query-data/flux/histograms/)._

### Covariance
Flux provides functions for simple covariance calculations.
Use the [`covariance()` function](/{{< latest "flux" >}}/stdlib/universe/covariance)
to calculate the covariance between two columns and the [`cov()` function](/{{< latest "flux" >}}/stdlib/universe/cov)
to calculate the covariance between two data streams.

###### Covariance between two columns
```js
from(bucket: "example-bucket")
  |> range(start:-5m)
  |> covariance(columns: ["x", "y"])
```

###### Covariance between two streams of data
```js
table1 = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_1"
  )

table2 = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_2"
  )

cov(x: table1, y: table2, on: ["_time", "_field"])
```

### Cast booleans to integers
InfluxQL supports type casting for numeric data types (floats to integers and vice versa) only.
Use [Flux type conversion functions](/{{< latest "flux" >}}/function-types/#type-conversions)
to perform many more type conversions, including casting boolean values to integers.

##### Cast boolean field values to integers
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "m" and
    r._field == "bool_field"
  )
  |> toInt()
```

### String manipulation and data shaping
InfluxQL doesn't support string manipulation when querying data.
Use [Flux Strings package](/{{< latest "flux" >}}/stdlib/strings/) functions to operate on string data.
Combine functions in this package with the [`map()` function](/{{< latest "flux" >}}/stdlib/universe/map/) to perform operations like sanitizing and normalizing strings.

```js
import "strings"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "weather" and
    r._field == "temp"
  )
  |> map(fn: (r) => ({
    r with
    location: strings.toTitle(v: r.location),
    sensor: strings.replaceAll(v: r.sensor, t: " ", u: "-"),
    status: strings.substring(v: r.status, start: 0, end: 8)
  }))
```

### Work with geo-temporal data
InfluxQL doesn't support working with geo-temporal data.
The [Flux Geo package](/{{< latest "flux" >}}/stdlib/experimental/geo/) is a collection of functions that
let you shape, filter, and group geo-temporal data.

```js
import "experimental/geo"

from(bucket: "geo/autogen")
  |> range(start: -1w)
  |> filter(fn: (r) => r._measurement == "taxi")
  |> geo.shapeData(latField: "latitude", lonField: "longitude", level: 20)
  |> geo.filterRows(
    region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0},
    strict: true
  )
  |> geo.asTracks(groupBy: ["fare-id"])
```


## InfluxQL and Flux parity
We're continuing to add functions to complete parity between Flux and InfluxQL.
The table below shows InfluxQL statements, clauses, and functions along with their equivalent Flux functions.

_For a complete list of Flux functions, [view all Flux functions](/{{< latest "flux" >}}/stdlib/all-functions/)._

| InfluxQL                                                                                                                                          | Flux Functions                                                                                                                                                                                           |
| :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SELECT](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-basic-select-statement)                                                 | [filter()](/{{< latest "flux" >}}/stdlib/universe/filter/)                                                                                                                                               |
| [WHERE](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-where-clause)                                                            | [filter()](/{{< latest "flux" >}}/stdlib/universe/filter/), [range()](/{{< latest "flux" >}}/stdlib/universe/range/)                                                                                     |
| [GROUP BY](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause)                                                      | [group()](/{{< latest "flux" >}}/stdlib/universe/group/)                                                                                                                                                 |
| [INTO](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-into-clause)                                                              | [to()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/to/)                                                                                                                                            |
| [ORDER BY](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#order-by-time-desc)                                                       | [sort()](/{{< latest "flux" >}}/stdlib/universe/sort/)                                                                                                                                                   |
| [LIMIT](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-limit-clause)                                                            | [limit()](/{{< latest "flux" >}}/stdlib/universe/limit/)                                                                                                                                                 |
| [SLIMIT](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-slimit-clause)                                                          | --                                                                                                                                                                                                       |
| [OFFSET](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-offset-clause)                                                          | --                                                                                                                                                                                                       |
| [SOFFSET](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-soffset-clause)                                                        | --                                                                                                                                                                                                       |
| [SHOW DATABASES](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-databases)                                                   | [buckets()](/{{< latest "flux" >}}/stdlib/universe/buckets/)                                                                                                                                             |
| [SHOW MEASUREMENTS](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements)                                             | [schema.measurements](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurements)                                                                                                             |
| [SHOW FIELD KEYS](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys)                                                 | [keys()](/{{< latest "flux" >}}/stdlib/universe/keys/)                                                                                                                                                   |
| [SHOW RETENTION POLICIES](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-retention-policies)                                 | [buckets()](/{{< latest "flux" >}}/stdlib/universe/buckets/)                                                                                                                                             |
| [SHOW TAG KEYS](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys)                                                     | [schema.tagKeys()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagkeys), [schema.measurementTagKeys()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagkeys)         |
| [SHOW TAG VALUES](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-values)                                                 | [schema.tagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagvalues), [schema.measurementTagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagvalues) |
| [SHOW SERIES](/{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-series)                                                         | --                                                                                                                                                                                                       |
| [CREATE DATABASE](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#create-database)                                                | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [DROP DATABASE](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-a-database-with-drop-database)                             | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [DROP SERIES](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#drop-series-from-the-index-with-drop-serie)                         | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [DELETE](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete)                                               | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [DROP MEASUREMENT](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement)                     | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [DROP SHARD](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-a-shard-with-drop-shard)                                      | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [CREATE RETENTION POLICY](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#create-retention-policies-with-create-retention-policy) | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [ALTER RETENTION POLICY](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy)   | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [DROP RETENTION POLICY](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-retention-policies-with-drop-retention-policy)     | <span style="opacity:.25;font-weight:500;">N/A</span>                                                                                                                                                    |
| [COUNT](/{{< latest "influxdb" "v1" >}}/query_language/functions#count)                                                                           | [count()](/{{< latest "flux" >}}/stdlib/universe/count/)                                                                                                                                                 |
| [DISTINCT](/{{< latest "influxdb" "v1" >}}/query_language/functions#distinct)                                                                     | [distinct()](/{{< latest "flux" >}}/stdlib/universe/distinct/)                                                                                                                                           |
| [INTEGRAL](/{{< latest "influxdb" "v1" >}}/query_language/functions#integral)                                                                     | [integral()](/{{< latest "flux" >}}/stdlib/universe/integral/)                                                                                                                                           |
| [MEAN](/{{< latest "influxdb" "v1" >}}/query_language/functions#mean)                                                                             | [mean()](/{{< latest "flux" >}}/stdlib/universe/mean/)                                                                                                                                                   |
| [MEDIAN](/{{< latest "influxdb" "v1" >}}/query_language/functions#median)                                                                         | [median()](/{{< latest "flux" >}}/stdlib/universe/median/)                                                                                                                                               |
| [MODE](/{{< latest "influxdb" "v1" >}}/query_language/functions#mode)                                                                             | [mode()](/{{< latest "flux" >}}/stdlib/universe/mode/)                                                                                                                                                   |
| [SPREAD](/{{< latest "influxdb" "v1" >}}/query_language/functions#spread)                                                                         | [spread()](/{{< latest "flux" >}}/stdlib/universe/spread/)                                                                                                                                               |
| [STDDEV](/{{< latest "influxdb" "v1" >}}/query_language/functions#stddev)                                                                         | [stddev()](/{{< latest "flux" >}}/stdlib/universe/stddev/)                                                                                                                                               |
| [SUM](/{{< latest "influxdb" "v1" >}}/query_language/functions#sum)                                                                               | [sum()](/{{< latest "flux" >}}/stdlib/universe/sum/)                                                                                                                                                     |
| [BOTTOM](/{{< latest "influxdb" "v1" >}}/query_language/functions#bottom)                                                                         | [bottom()](/{{< latest "flux" >}}/stdlib/universe/bottom/)                                                                                                                                               |
| [FIRST](/{{< latest "influxdb" "v1" >}}/query_language/functions#first)                                                                           | [first()](/{{< latest "flux" >}}/stdlib/universe/first/)                                                                                                                                                 |
| [LAST](/{{< latest "influxdb" "v1" >}}/query_language/functions#last)                                                                             | [last()](/{{< latest "flux" >}}/stdlib/universe/last/)                                                                                                                                                   |
| [MAX](/{{< latest "influxdb" "v1" >}}/query_language/functions#max)                                                                               | [max()](/{{< latest "flux" >}}/stdlib/universe/max/)                                                                                                                                                     |
| [MIN](/{{< latest "influxdb" "v1" >}}/query_language/functions#min)                                                                               | [min()](/{{< latest "flux" >}}/stdlib/universe/min/)                                                                                                                                                     |
| [PERCENTILE](/{{< latest "influxdb" "v1" >}}/query_language/functions#percentile)                                                                 | [quantile()](/{{< latest "flux" >}}/stdlib/universe/quantile/)                                                                                                                                           |
| [SAMPLE](/{{< latest "influxdb" "v1" >}}/query_language/functions#sample)                                                                         | [sample()](/{{< latest "flux" >}}/stdlib/universe/sample/)                                                                                                                                               |
| [TOP](/{{< latest "influxdb" "v1" >}}/query_language/functions#top)                                                                               | [top()](/{{< latest "flux" >}}/stdlib/universe/top/)                                                                                                                                                     |
| [ABS](/{{< latest "influxdb" "v1" >}}/query_language/functions#abs)                                                                               | [math.abs()](/{{< latest "flux" >}}/stdlib/math/abs/)                                                                                                                                                    |
| [ACOS](/{{< latest "influxdb" "v1" >}}/query_language/functions#acos)                                                                             | [math.acos()](/{{< latest "flux" >}}/stdlib/math/acos/)                                                                                                                                                  |
| [ASIN](/{{< latest "influxdb" "v1" >}}/query_language/functions#asin)                                                                             | [math.asin()](/{{< latest "flux" >}}/stdlib/math/asin/)                                                                                                                                                  |
| [ATAN](/{{< latest "influxdb" "v1" >}}/query_language/functions#atan)                                                                             | [math.atan()](/{{< latest "flux" >}}/stdlib/math/atan/)                                                                                                                                                  |
| [ATAN2](/{{< latest "influxdb" "v1" >}}/query_language/functions#atan2)                                                                           | [math.atan2()](/{{< latest "flux" >}}/stdlib/math/atan2/)                                                                                                                                                |
| [CEIL](/{{< latest "influxdb" "v1" >}}/query_language/functions#ceil)                                                                             | [math.ceil()](/{{< latest "flux" >}}/stdlib/math/ceil/)                                                                                                                                                  |
| [COS](/{{< latest "influxdb" "v1" >}}/query_language/functions#cos)                                                                               | [math.cos()](/{{< latest "flux" >}}/stdlib/math/cos/)                                                                                                                                                    |
| [CUMULATIVE_SUM](/{{< latest "influxdb" "v1" >}}/query_language/functions#cumulative-sum)                                                         | [cumulativeSum()](/{{< latest "flux" >}}/stdlib/universe/cumulativesum/)                                                                                                                                 |
| [DERIVATIVE](/{{< latest "influxdb" "v1" >}}/query_language/functions#derivative)                                                                 | [derivative()](/{{< latest "flux" >}}/stdlib/universe/derivative/)                                                                                                                                       |
| [DIFFERENCE](/{{< latest "influxdb" "v1" >}}/query_language/functions#difference)                                                                 | [difference()](/{{< latest "flux" >}}/stdlib/universe/difference/)                                                                                                                                       |
| [ELAPSED](/{{< latest "influxdb" "v1" >}}/query_language/functions#elapsed)                                                                       | [elapsed()](/{{< latest "flux" >}}/stdlib/universe/elapsed/)                                                                                                                                             |
| [EXP](/{{< latest "influxdb" "v1" >}}/query_language/functions#exp)                                                                               | [math.exp()](/{{< latest "flux" >}}/stdlib/math/exp/)                                                                                                                                                    |
| [FLOOR](/{{< latest "influxdb" "v1" >}}/query_language/functions#floor)                                                                           | [math.floor()](/{{< latest "flux" >}}/stdlib/math/floor/)                                                                                                                                                |
| [HISTOGRAM](/{{< latest "influxdb" "v1" >}}/query_language/functions#histogram)                                                                   | [histogram()](/{{< latest "flux" >}}/stdlib/universe/histogram/)                                                                                                                                         |
| [LN](/{{< latest "influxdb" "v1" >}}/query_language/functions#ln)                                                                                 | [math.log()](/{{< latest "flux" >}}/stdlib/math/log/)                                                                                                                                                    |
| [LOG](/{{< latest "influxdb" "v1" >}}/query_language/functions#log)                                                                               | [math.logb()](/{{< latest "flux" >}}/stdlib/math/logb/)                                                                                                                                                  |
| [LOG2](/{{< latest "influxdb" "v1" >}}/query_language/functions#log2)                                                                             | [math.log2()](/{{< latest "flux" >}}/stdlib/math/log2/)                                                                                                                                                  |
| [LOG10](/{{< latest "influxdb" "v1" >}}/query_language/functions#logt10)                                                                          | [math.log10()](/{{< latest "flux" >}}/stdlib/math/log10/)                                                                                                                                                |
| [MOVING_AVERAGE](/{{< latest "influxdb" "v1" >}}/query_language/functions#moving-average)                                                         | [movingAverage()](/{{< latest "flux" >}}/stdlib/universe/movingaverage/)                                                                                                                                 |
| [NON_NEGATIVE_DERIVATIVE](/{{< latest "influxdb" "v1" >}}/query_language/functions#non-negative-derivative)                                       | [derivative(nonNegative:true)](/{{< latest "flux" >}}/stdlib/universe/derivative/)                                                                                                                       |
| [NON_NEGATIVE_DIFFERENCE](/{{< latest "influxdb" "v1" >}}/query_language/functions#non-negative-difference)                                       | [difference(nonNegative:true)](/{{< latest "flux" >}}/stdlib/universe/derivative/)                                                                                                                       |
| [POW](/{{< latest "influxdb" "v1" >}}/query_language/functions#pow)                                                                               | [math.pow()](/{{< latest "flux" >}}/stdlib/math/pow/)                                                                                                                                                    |
| [ROUND](/{{< latest "influxdb" "v1" >}}/query_language/functions#round)                                                                           | [math.round()](/{{< latest "flux" >}}/stdlib/math/round/)                                                                                                                                                |
| [SIN](/{{< latest "influxdb" "v1" >}}/query_language/functions#sin)                                                                               | [math.sin()](/{{< latest "flux" >}}/stdlib/math/sin/)                                                                                                                                                    |
| [SQRT](/{{< latest "influxdb" "v1" >}}/query_language/functions#sqrt)                                                                             | [math.sqrt()](/{{< latest "flux" >}}/stdlib/math/sqrt/)                                                                                                                                                  |
| [TAN](/{{< latest "influxdb" "v1" >}}/query_language/functions#tan)                                                                               | [math.tan()](/{{< latest "flux" >}}/stdlib/math/tan/)                                                                                                                                                    |
| [HOLT_WINTERS](/{{< latest "influxdb" "v1" >}}/query_language/functions#holt-winters)                                                             | [holtWinters()](/{{< latest "flux" >}}/stdlib/universe/holtwinters/)                                                                                                                                     |
| [CHANDE_MOMENTUM_OSCILLATOR](/{{< latest "influxdb" "v1" >}}/query_language/functions#chande-momentum-oscillator)                                 | [chandeMomentumOscillator()](/{{< latest "flux" >}}/stdlib/universe/chandemomentumoscillator/)                                                                                                           |
| [EXPONENTIAL_MOVING_AVERAGE](/{{< latest "influxdb" "v1" >}}/query_language/functions#exponential-moving-average)                                 | [exponentialMovingAverage()](/{{< latest "flux" >}}/stdlib/universe/exponentialmovingaverage/)                                                                                                           |
| [DOUBLE_EXPONENTIAL_MOVING_AVERAGE](/{{< latest "influxdb" "v1" >}}/query_language/functions#double-exponential-moving-average)                   | [doubleEMA()](/{{< latest "flux" >}}/stdlib/universe/doubleema/)                                                                                                                                         |
| [KAUFMANS_EFFICIENCY_RATIO](/{{< latest "influxdb" "v1" >}}/query_language/functions#kaufmans-efficiency-ratio)                                   | [kaufmansER()](/{{< latest "flux" >}}/stdlib/universe/kaufmanser/)                                                                                                                                       |
| [KAUFMANS_ADAPTIVE_MOVING_AVERAGE](/{{< latest "influxdb" "v1" >}}/query_language/functions#kaufmans-adaptive-moving-average)                     | [kaufmansAMA()](/{{< latest "flux" >}}/stdlib/universe/kaufmansama/)                                                                                                                                     |
| [TRIPLE_EXPONENTIAL_MOVING_AVERAGE](/{{< latest "influxdb" "v1" >}}/query_language/functions#triple-exponential-moving-average)                   | [tripleEMA()](/{{< latest "flux" >}}/stdlib/universe/tripleema/)                                                                                                                                         |
| [TRIPLE_EXPONENTIAL_DERIVATIVE](/{{< latest "influxdb" "v1" >}}/query_language/functions#triple-exponential-derivative)                           | [tripleExponentialDerivative()](/{{< latest "flux" >}}/stdlib/universe/tripleexponentialderivative/)                                                                                                     |
| [RELATIVE_STRENGTH_INDEX](/{{< latest "influxdb" "v1" >}}/query_language/functions#relative-strength-index)                                       | [relativeStrengthIndex()](/{{< latest "flux" >}}/stdlib/universe/relativestrengthindex/)                                                                                                                 |
