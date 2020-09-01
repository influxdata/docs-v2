---
title: Flux vs InfluxQL
description:
menu:
  influxdb_1_8:
    name: Flux vs InfluxQL
    parent: Flux
    weight: 5
---

Flux is an alternative to [InfluxQL](/influxdb/v1.8/query_language/) and other SQL-like query languages for querying and analyzing data.
Flux uses functional language patterns making it incredibly powerful, flexible, and able to overcome many of the limitations of InfluxQL.
This article outlines many of the tasks possible with Flux but not InfluxQL and provides information about Flux and InfluxQL parity.

- [Possible with Flux](#possible-with-flux)
- [InfluxQL and Flux parity](#influxql-and-flux-parity)

## Possible with Flux

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
InfluxQL has never supported joins. They can be accomplished using [TICKscript](/{{< latest "kapacitor" >}}/tick/introduction/),
but even TICKscript's join capabilities are limited.
Flux's [`join()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/join/) allows you
to join data **from any bucket, any measurement, and on any columns** as long as
each data set includes the columns on which they are to be joined.
This opens the door for really powerful and useful operations.

```js
dataStream1 = from(bucket: "bucket1")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "network" and
    r._field == "bytes-transferred"
  )

dataStream2 = from(bucket: "bucket1")
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


---

_For an in-depth walkthrough of using the `join()` function, see [How to join data with Flux](/influxdb/v1.8/flux/guides/join)._

---

### Math across measurements
Being able to perform cross-measurement joins also allows you to run calculations using
data from separate measurements – a highly requested feature from the InfluxData community.
The example below takes two data streams from separate measurements, `mem` and `processes`,
joins them, then calculates the average amount of memory used per running process:

```js
// Memory used (in bytes)
memUsed = from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used"
  )

// Total processes running
procTotal = from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "processes" and
    r._field == "total"
    )

// Join memory used with total processes and calculate
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
InfluxQL's sorting capabilities are very limited, allowing you only to control the
sort order of `time` using the `ORDER BY time` clause.
Flux's [`sort()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/sort) sorts records based on list of columns.
Depending on the column type, records are sorted lexicographically, numerically, or chronologically.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

### Group by any column
InfluxQL lets you group by tags or by time intervals, but nothing else.
Flux lets you group by any column in the dataset, including `_value`.
Use the Flux [`group()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/group/)
to define which columns to group data by.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) => r._measurement == "system" and r._field == "uptime" )
  |> group(columns:["host", "_value"])
```

### Window by calendar months and years
InfluxQL does not support windowing data by calendar months and years due to their varied lengths.
Flux supports calendar month and year duration units (`1mo`, `1y`) and lets you
window and aggregate data by calendar month and year.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-1y)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  |> aggregateWindow(every: 1mo, fn: mean)
```

### Work with multiple data sources
InfluxQL can only query data stored in InfluxDB.
Flux can query data from other data sources such as CSV, PostgreSQL, MySQL, Google BigTable, and more.
Join that data with data in InfluxDB to enrich query results.

- [Flux CSV package](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/csv/)
- [Flux SQL package](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/sql/)
- [Flux BigTable package](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/experimental/bigtable/)

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
data = from(bucket: "telegraf/autogen")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "sensor")

auxData = join(tables: {csv: csvData, sql: sqlData}, on: ["sensor_id"])
enrichedData = join(tables: {data: data, aux: auxData}, on: ["sensor_id"])

enrichedData
  |> yield(name: "enriched_data")
```

---

_For an in-depth walkthrough of querying SQL data, see [Query SQL data sources](/influxdb/v1.8/flux/guides/sql)._

---

### DatePart-like queries
InfluxQL doesn't support DatePart-like queries that only return results during specified hours of the day.
The Flux [`hourSelection` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/hourselection/)
returns only data with time values in a specified hour range.

```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> hourSelection(start: 9, stop: 17)
```

### Pivot
Pivoting data tables has never been supported in InfluxQL.
The Flux [`pivot()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/pivot) provides the ability
to pivot data tables by specifying `rowKey`, `columnKey`, and `valueColumn` parameters.

```js
from(bucket: "telegraf/autogen")
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
The ability to generate histograms has been a highly requested feature for InfluxQL, but has never been supported.
Flux's [`histogram()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/histogram) uses input
data to generate a cumulative histogram with support for other histogram types coming in the future.

```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> histogram(
    buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  )
```

---

_For an example of using Flux to create a cumulative histogram, see [Create histograms](/influxdb/v1.8/flux/guides/histograms)._

---

### Covariance
Flux provides functions for simple covariance calculation.
The [`covariance()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/covariance)
calculates the covariance between two columns and the [`cov()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/cov)
calculates the covariance between two data streams.

###### Covariance between two columns
```js
from(bucket: "telegraf/autogen")
  |> range(start:-5m)
  |> covariance(columns: ["x", "y"])
```

###### Covariance between two streams of data
```js
table1 = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_1"
  )

table2 = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_2"
  )

cov(x: table1, y: table2, on: ["_time", "_field"])
```

### Cast booleans to integers
InfluxQL supports type casting, but only for numeric data types (floats to integers and vice versa).
[Flux type conversion functions](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/type-conversions/)
provide much broader support for type conversions and let you perform some long-requested
operations like casting a boolean values to integers.

##### Cast boolean field values to integers
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "m" and
    r._field == "bool_field"
  )
  |> toInt()
```

### String manipulation and data shaping
InfluxQL doesn't support string manipulation when querying data.
The [Flux Strings package](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/strings/) is a collection of functions that operate on string data.
When combined with the [`map()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/map/),
functions in the string package allow for operations like string sanitization and normalization.

```js
import "strings"

from(bucket: "telegraf/autogen")
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
InfluxQL doesn't provide functionality for working with geo-temporal data.
The [Flux Geo package](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/experimental/geo/) is a collection of functions that
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
Flux is working towards complete parity with InfluxQL and new functions are being added to that end.
The table below shows InfluxQL statements, clauses, and functions along with their equivalent Flux functions.

_For a complete list of Flux functions, [view all Flux functions](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/all-functions)._

### InfluxQL and Flux parity

| InfluxQL                                                                                                                         | Flux Functions                                                                                                                                                                                                     |
| --------                                                                                                                         | --------------                                                                                                                                                                                                     |
| [SELECT](/influxdb/v1.8/query_language/explore-data/#the-basic-select-statement)                                                 | [filter()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/filter/)                                                                                                                 |
| [WHERE](/influxdb/v1.8/query_language/explore-data/#the-where-clause)                                                            | [filter()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/filter/), [range()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/range/)               |
| [GROUP BY](/influxdb/v1.8/query_language/explore-data/#the-group-by-clause)                                                      | [group()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/group/)                                                                                                                   |
| [INTO](/influxdb/v1.8/query_language/explore-data/#the-into-clause)                                                              | [to()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/outputs/to/) <span><a style="color:orange" href="#footnote">*</a></span>                                                                     |
| [ORDER BY](/influxdb/v1.8/query_language/explore-data/#order-by-time-desc)                                                       | [sort()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/sort/)                                                                                                                     |
| [LIMIT](/influxdb/v1.8/query_language/explore-data/#the-limit-clause)                                                            | [limit()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/limit/)                                                                                                                   |
| [SLIMIT](/influxdb/v1.8/query_language/explore-data/#the-slimit-clause)                                                          | --                                                                                                                                                                                                                 |
| [OFFSET](/influxdb/v1.8/query_language/explore-data/#the-offset-clause)                                                          | --                                                                                                                                                                                                                 |
| [SOFFSET](/influxdb/v1.8/query_language/explore-data/#the-soffset-clause)                                                        | --                                                                                                                                                                                                                 |
| [SHOW DATABASES](/influxdb/v1.8/query_language/explore-schema/#show-databases)                                                   | [buckets()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/inputs/buckets/)                                                                                                                        |
| [SHOW MEASUREMENTS](/influxdb/v1.8/query_language/explore-schema/#show-measurements)                                             | [v1.measurements](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/influxdb-v1/measurements)                                                                                                                  |
| [SHOW FIELD KEYS](/influxdb/v1.8/query_language/explore-schema/#show-field-keys)                                                 | [keys()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/keys/)                                                                                                                     |
| [SHOW RETENTION POLICIES](/influxdb/v1.8/query_language/explore-schema/#show-retention-policies)                                 | [buckets()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/inputs/buckets/)                                                                                                                        |
| [SHOW TAG KEYS](/influxdb/v1.8/query_language/explore-schema/#show-tag-keys)                                                     | [v1.tagKeys()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/influxdb-v1/tagkeys), [v1.measurementTagKeys()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/influxdb-v1/measurementtagkeys)         |
| [SHOW TAG VALUES](/influxdb/v1.8/query_language/explore-schema/#show-tag-values)                                                 | [v1.tagValues()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/influxdb-v1/tagvalues), [v1.measurementTagValues()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/influxdb-v1/measurementtagvalues) |
| [SHOW SERIES](/influxdb/v1.8/query_language/explore-schema/#show-series)                                                         | --                                                                                                                                                                                                                 |
| [CREATE DATABASE](/influxdb/v1.8/query_language/manage-database/#create-database)                                                | --                                                                                                                                                                                                                 |
| [DROP DATABASE](/influxdb/v1.8/query_language/manage-database/#delete-a-database-with-drop-database)                             | --                                                                                                                                                                                                                 |
| [DROP SERIES](/influxdb/v1.8/query_language/manage-database/#drop-series-from-the-index-with-drop-series)                        | --                                                                                                                                                                                                                 |
| [DELETE](/influxdb/v1.8/query_language/manage-database/#delete-series-with-delete)                                               | --                                                                                                                                                                                                                 |
| [DROP MEASUREMENT](/influxdb/v1.8/query_language/manage-database/#delete-measurements-with-drop-measurement)                     | --                                                                                                                                                                                                                 |
| [DROP SHARD](/influxdb/v1.8/query_language/manage-database/#delete-a-shard-with-drop-shard)                                      | --                                                                                                                                                                                                                 |
| [CREATE RETENTION POLICY](/influxdb/v1.8/query_language/manage-database/#create-retention-policies-with-create-retention-policy) | --                                                                                                                                                                                                                 |
| [ALTER RETENTION POLICY](/influxdb/v1.8/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy)   | --                                                                                                                                                                                                                 |
| [DROP RETENTION POLICY](/influxdb/v1.8/query_language/manage-database/#delete-retention-policies-with-drop-retention-policy)     | --                                                                                                                                                                                                                 |
| [COUNT](/influxdb/v1.8/query_language/functions#count)                                                                           | [count()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/count/)                                                                                                        |
| [DISTINCT](/influxdb/v1.8/query_language/functions#distinct)                                                                     | [distinct()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/distinct/)                                                                                                   |
| [INTEGRAL](/influxdb/v1.8/query_language/functions#integral)                                                                     | [integral()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/integral/)                                                                                                  |
| [MEAN](/influxdb/v1.8/query_language/functions#mean)                                                                             | [mean()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/mean/)                                                                                                          |
| [MEDIAN](/influxdb/v1.8/query_language/functions#median)                                                                         | [median()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/median/)                                                                                                      |
| [MODE](/influxdb/v1.8/query_language/functions#mode)                                                                             | [mode()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/mode/)                                                                                                          |
| [SPREAD](/influxdb/v1.8/query_language/functions#spread)                                                                         | [spread()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/spread/)                                                                                                      |
| [STDDEV](/influxdb/v1.8/query_language/functions#stddev)                                                                         | [stddev()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/stddev/)                                                                                                      |
| [SUM](/influxdb/v1.8/query_language/functions#sum)                                                                               | [sum()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/sum/)                                                                                                            |
| [BOTTOM](/influxdb/v1.8/query_language/functions#bottom)                                                                         | [bottom()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/bottom/)                                                                                                       |
| [FIRST](/influxdb/v1.8/query_language/functions#first)                                                                           | [first()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/first/)                                                                                                         |
| [LAST](/influxdb/v1.8/query_language/functions#last)                                                                             | [last()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/last/)                                                                                                           |
| [MAX](/influxdb/v1.8/query_language/functions#max)                                                                               | [max()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/max/)                                                                                                             |
| [MIN](/influxdb/v1.8/query_language/functions#min)                                                                               | [min()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/min/)                                                                                                             |
| [PERCENTILE](/influxdb/v1.8/query_language/functions#percentile)                                                                 | [quantile()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/quantile/)                                                                                                  |
| [SAMPLE](/influxdb/v1.8/query_language/functions#sample)                                                                         | [sample()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/sample/)                                                                                                       |
| [TOP](/influxdb/v1.8/query_language/functions#top)                                                                               | [top()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/selectors/top/)                                                                                                             |
| [ABS](/influxdb/v1.8/query_language/functions#abs)                                                                               | [math.abs()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/abs/)                                                                                                                                      |
| [ACOS](/influxdb/v1.8/query_language/functions#acos)                                                                             | [math.acos()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/acos/)                                                                                                                                    |
| [ASIN](/influxdb/v1.8/query_language/functions#asin)                                                                             | [math.asin()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/asin/)                                                                                                                                    |
| [ATAN](/influxdb/v1.8/query_language/functions#atan)                                                                             | [math.atan()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/atan/)                                                                                                                                    |
| [ATAN2](/influxdb/v1.8/query_language/functions#atan2)                                                                           | [math.atan2()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/atan2/)                                                                                                                                  |
| [CEIL](/influxdb/v1.8/query_language/functions#ceil)                                                                             | [math.ceil()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/ceil/)                                                                                                                                    |
| [COS](/influxdb/v1.8/query_language/functions#cos)                                                                               | [math.cos()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/cos/)                                                                                                                                      |
| [CUMULATIVE_SUM](/influxdb/v1.8/query_language/functions#cumulative-sum)                                                         | [cumulativeSum()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/cumulativesum/)                                                                                                   |
| [DERIVATIVE](/influxdb/v1.8/query_language/functions#derivative)                                                                 | [derivative()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/derivative/)                                                                                                         |
| [DIFFERENCE](/influxdb/v1.8/query_language/functions#difference)                                                                 | [difference()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/difference/)                                                                                                         |
| [ELAPSED](/influxdb/v1.8/query_language/functions#elapsed)                                                                       | [elapsed()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/elapsed/)                                                                                                               |
| [EXP](/influxdb/v1.8/query_language/functions#exp)                                                                               | [math.exp()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/exp/)                                                                                                                                      |
| [FLOOR](/influxdb/v1.8/query_language/functions#floor)                                                                           | [math.floor()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/floor/)                                                                                                                                  |
| [HISTOGRAM](/influxdb/v1.8/query_language/functions#histogram)                                                                   | [histogram()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/histogram/)                                                                                                           |
| [LN](/influxdb/v1.8/query_language/functions#ln)                                                                                 | [math.log()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/log/)                                                                                                                                      |
| [LOG](/influxdb/v1.8/query_language/functions#log)                                                                               | [math.logb()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/logb/)                                                                                                                                    |
| [LOG2](/influxdb/v1.8/query_language/functions#log2)                                                                             | [math.log2()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/log2/)                                                                                                                                    |
| [LOG10](/influxdb/v1.8/query_language/functions/#log10)                                                                          | [math.log10()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/log10/)                                                                                                                                  |
| [MOVING_AVERAGE](/influxdb/v1.8/query_language/functions#moving-average)                                                         | [movingAverage()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/movingaverage/)                                                                                                   |
| [NON_NEGATIVE_DERIVATIVE](/influxdb/v1.8/query_language/functions#non-negative-derivative)                                       | [derivative(nonNegative:true)](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/derivative/)                                                                                         |
| [NON_NEGATIVE_DIFFERENCE](/influxdb/v1.8/query_language/functions#non-negative-difference)                                       | [difference(nonNegative:true)](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/derivative/)                                                                                         |
| [POW](/influxdb/v1.8/query_language/functions#pow)                                                                               | [math.pow()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/pow/)                                                                                                                                      |
| [ROUND](/influxdb/v1.8/query_language/functions#round)                                                                           | [math.round()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/round/)                                                                                                                                  |
| [SIN](/influxdb/v1.8/query_language/functions#sin)                                                                               | [math.sin()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/sin/)                                                                                                                                      |
| [SQRT](/influxdb/v1.8/query_language/functions#sqrt)                                                                             | [math.sqrt()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/sqrt/)                                                                                                                                    |
| [TAN](/influxdb/v1.8/query_language/functions#tan)                                                                               | [math.tan()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/math/tan/)                                                                                                                                      |
| [HOLT_WINTERS](/influxdb/v1.8/query_language/functions#holt-winters)                                                             | [holtWinters()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/holtwinters/)                                                                                                       |
| [CHANDE_MOMENTUM_OSCILLATOR](/influxdb/v1.8/query_language/functions#chande-momentum-oscillator)                                 | [chandeMomentumOscillator()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/chandemomentumoscillator/)                                                                             |
| [EXPONENTIAL_MOVING_AVERAGE](/influxdb/v1.8/query_language/functions#exponential-moving-average)                                 | [exponentialMovingAverage()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/)                                                                             |
| [DOUBLE_EXPONENTIAL_MOVING_AVERAGE](/influxdb/v1.8/query_language/functions#double-exponential-moving-average)                   | [doubleEMA()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/doubleema/)                                                                                                           |
| [KAUFMANS_EFFICIENCY_RATIO](/influxdb/v1.8/query_language/functions#kaufmans-efficiency-ratio)                                   | [kaufmansER()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/kaufmanser/)                                                                                                         |
| [KAUFMANS_ADAPTIVE_MOVING_AVERAGE](/influxdb/v1.8/query_language/functions#kaufmans-adaptive-moving-average)                     | [kaufmansAMA()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/kaufmansama/)                                                                                                       |
| [TRIPLE_EXPONENTIAL_MOVING_AVERAGE](/influxdb/v1.8/query_language/functions#triple-exponential-moving-average)                   | [tripleEMA()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/tripleema/)                                                                                                           |
| [TRIPLE_EXPONENTIAL_DERIVATIVE](/influxdb/v1.8/query_language/functions#triple-exponential-derivative)                           | [tripleExponentialDerivative()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/tripleexponentialderivative/)                                                                       |
| [RELATIVE_STRENGTH_INDEX](/influxdb/v1.8/query_language/functions#relative-strength-index)                                       | [relativeStrengthIndex()](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/relativestrengthindex/)                                                                                   |

_<span style="font-size:.9rem" id="footnote"><span style="color:orange">*</span> The <code>to()</code> function only writes to InfluxDB 2.0.</span>_
