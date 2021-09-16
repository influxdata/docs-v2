---
title: Query InfluxDB with Flux
description: Learn the basics of using Flux to query data from InfluxDB.
influxdb/v2.0/tags: [query, flux]
menu:
  influxdb_2_0:
    name: Query InfluxDB
    parent: Get started with Flux
weight: 201
related:
  - /{{< latest "flux" >}}/get-started/query-basics/
  - /influxdb/v2.0/query-data/flux/
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/from
  - /{{< latest "flux" >}}/stdlib/universe/range
  - /{{< latest "flux" >}}/stdlib/universe/filter
---

This guide walks through the basics of using Flux to query data from InfluxDB.
Every Flux query needs the following:

1. [A data source](#1-define-your-data-source)
2. [A time range](#2-specify-a-time-range)
3. [Data filters](#3-filter-your-data)


## 1. Define your data source
Flux's [`from()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/) function defines an InfluxDB data source.
It requires a [`bucket`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/#bucket) parameter.
The following examples use `example-bucket` as the bucket name.

```js
from(bucket:"example-bucket")
```

## 2. Specify a time range
Flux requires a time range when querying time series data.
"Unbounded" queries are very resource-intensive and as a protective measure,
Flux will not query the database without a specified range.

Use the [pipe-forward operator](/{{< latest "flux" >}}/get-started/syntax-basics/#pipe-forward-operator)
(`|>`) to pipe data from your data source into
[`range()`](/{{< latest "flux" >}}/stdlib/universe/range), which specifies a time range for your query.
It accepts two parameters: `start` and `stop`.
Start and stop values can be **relative** using negative [durations](/{{< latest "flux" >}}/data-types/basic/duration/)
or **absolute** using [timestamps](/{{< latest "flux" >}}/data-types/basic/time/).

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
  |> range(start: 2021-01-01T00:00:00Z, stop: 2021-01-01T12:00:00Z)
```

#### Use the following:
For this guide, use the relative time range, `-15m`, to limit query results to data from the last 15 minutes:

```js
from(bucket:"example-bucket")
  |> range(start: -15m)
```

## 3. Filter your data
Pass your ranged data into `filter()` to narrow results based on data attributes or columns.
`filter()` has one parameter, `fn`, which expects a
[predicate function](/{{< latest "flux" >}}/get-started/syntax-basics/#predicate-functions)
evaluates rows by column values.

`filter()` iterates over every input row and structures row data as a Flux
[record](/{{< latest "flux" >}}/data-types/composite/record/). 
The record is passed into the predicate function as `r` where it is evaluated using
[predicate expressions](/{{< latest "flux" >}}/get-started/syntax-basics/#predicate-expressions).

Rows that evaluate to `false` are dropped from the output data.
Rows that evaluate to `true` persist in the output data.

```js
// Pattern
(r) => (r.recordProperty comparisonOperator comparisonExpression)

// Example with single filter
(r) => (r._measurement == "cpu")

// Example with multiple filters
(r) => r._measurement == "cpu" and r._field != "usage_system")
```

#### Use the following:
For this example, filter by the `cpu` measurement, `usage_system` field, and
`cpu-total` tag value:

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
[`yield()`](/{{< latest "flux" >}}/stdlib/universe/yield/) outputs the result of the query.

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
the end of each script to output and visualize the data.
Explicitly calling `yield()` is only necessary when including multiple queries
in the same Flux query.
Each set of returned data needs to be named using the `yield()` function.

## Congratulations!
You have now queried data from InfluxDB using Flux.

The query shown here is a basic example.
Flux queries can be extended in many ways to form powerful scripts.

{{< page-nav prev="/influxdb/v2.0/query-data/get-started/" next="/influxdb/v2.0/query-data/get-started/transform-data/" >}}
