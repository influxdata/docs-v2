---
title: Query InfluxDB with Flux
description: Learn the basics of using Flux to query data from InfluxDB.
influxdb/cloud/tags: [query, flux]
menu:
  influxdb_cloud:
    name: Query InfluxDB
    parent: Get started with Flux
weight: 201
related:
  - /influxdb/cloud/query-data/flux/
  - /influxdb/cloud/reference/flux/stdlib/built-in/inputs/from
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/range
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/filter
---

This guide walks through the basics of using Flux to query data from InfluxDB.
Every Flux query needs the following:

1. [A data source](#1-define-your-data-source)
2. [A time range](#2-specify-a-time-range)
3. [Data filters](#3-filter-your-data)


## 1. Define your data source
Flux's [`from()`](/influxdb/cloud/reference/flux/stdlib/built-in/inputs/from) function defines an InfluxDB data source.
It requires a [`bucket`](/influxdb/cloud/reference/flux/stdlib/built-in/inputs/from#bucket) parameter.
The following examples use `example-bucket` as the bucket name.

```js
from(bucket:"example-bucket")
```

## 2. Specify a time range
Flux requires a time range when querying time series data.
"Unbounded" queries are very resource-intensive and as a protective measure,
Flux will not query the database without a specified range.

Use the pipe-forward operator (`|>`) to pipe data from your data source into the [`range()`](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/range)
function, which specifies a time range for your query.
It accepts two parameters: `start` and `stop`.
Ranges can be **relative** using negative [durations](/influxdb/cloud/reference/flux/language/lexical-elements#duration-literals)
or **absolute** using [timestamps](/influxdb/cloud/reference/flux/language/lexical-elements#date-and-time-literals).

###### Example relative time ranges
```js
// Relative time range with start only. Stop defaults to now.
from(bucket:"example-bucket")
  |> range(start: -1h)

// Relative time range with start and stop
from(bucket:"example-bucket")
  |> range(start: -1h, stop: -10m)
```

{{% note %}}
Relative ranges are relative to "now."
{{% /note %}}

###### Example absolute time range
```js
from(bucket:"example-bucket")
  |> range(start: 2018-11-05T23:30:00Z, stop: 2018-11-06T00:00:00Z)
```

#### Use the following:
For this guide, use the relative time range, `-15m`, to limit query results to data from the last 15 minutes:

```js
from(bucket:"example-bucket")
  |> range(start: -15m)
```

## 3. Filter your data
Pass your ranged data into the `filter()` function to narrow results based on data attributes or columns.
The `filter()` function has one parameter, `fn`, which expects an anonymous function
with logic that filters data based on columns or attributes.

Flux's anonymous function syntax is similar to Javascript's.
Records or rows are passed into the `filter()` function as a record (`r`).
The anonymous function takes the record and evaluates it to see if it matches the defined filters.
Use the `and` relational operator to chain multiple filters.

```js
// Pattern
(r) => (r.recordProperty comparisonOperator comparisonExpression)

// Example with single filter
(r) => (r._measurement == "cpu")

// Example with multiple filters
(r) => (r._measurement == "cpu") and (r._field != "usage_system" )
```

#### Use the following:
For this example, filter by the `cpu` measurement, the `usage_system` field, and the `cpu-total` tag value:

```js
from(bucket:"example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
```

## 4. Yield your queried data
Flux's `yield()` function outputs the filtered tables as the result of the query.

```js
from(bucket:"example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
  |> yield()
```

Flux automatically assumes a `yield()` function at
the end of each script in order to output and visualize the data.
Explicitly calling `yield()` is only necessary when including multiple queries in the same Flux query.
Each set of returned data needs to be named using the `yield()` function.

## Congratulations!
You have now queried data from InfluxDB using Flux.

The query shown here is a barebones example.
Flux queries can be extended in many ways to form powerful scripts.


<div class="page-nav-btns">
  <a class="btn prev" href="/v2.0/query-data/get-started/">Get started with Flux</a>
  <a class="btn next" href="/v2.0/query-data/get-started/transform-data/">Transform your data</a>
</div>
