---
title: Optimize Flux queries
description: >
  Optimize your Flux queries to reduce their memory and compute (CPU) requirements.
weight: 104
menu:
  influxdb_cloud:
    name: Optimize queries
    parent: Query data
influxdb/cloud/tags: [query]
---

Optimize your Flux queries to reduce their memory and compute (CPU) requirements.

- [Start queries with pushdown functions](#start-queries-with-pushdown-functions)
- [Avoid short window durations](#avoid-short-window-durations)
- [Use "heavy" functions sparingly](#use-heavy-functions-sparingly)
- [Balance time range and data precision](#balance-time-range-and-data-precision)

## Start queries with pushdown functions
Some Flux functions can push their data manipulation down to the underlying
data source rather than storing and manipulating data in memory.
These are known as "pushdown" functions and using them correctly can greatly
reduce the amount of memory necessary to run a query.

#### Pushdown functions
- [range()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/range/)
- [filter()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/filter/)
- [group()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/group/)
- [count()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/count/)
- [sum()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/sum/)
- [first()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/first/)
- [last()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/last/)

Use pushdown functions at the beginning of your query.
Once a non-pushdown function runs, Flux pulls data into memory and runs all
subsequent operations there.

##### Pushdown functions in use
```js
from(bucket: "example-bucket")
  |> range(start: -1h)                       //
  |> filter(fn: (r) => r.sensor == "abc123") // Pushed to the data source
  |> group(columns: ["_field", "host"])      //

  |> aggregateWindow(every: 5m, fn: max)     //
  |> filter(fn: (r) => r._value >= 90.0)     // Run in memory
  |> top(n: 10)                              //
```

## Avoid short window durations
Windowing (grouping data based on time intervals) is commonly used to aggregate and downsample data.
Increase performance by avoiding short window durations.
More windows require more compute power to evaluate which window each row should be assigned to.
Reasonable window durations depend on the total time range queried.

## Use "heavy" functions sparingly
The following functions use more memory or CPU than others.
Consider their necessity in your data processing before using them:

- [map()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/map/)
- [reduce()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/reduce/)
- [window()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/window/)
- [join()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/join/)
- [union()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/union/)
- [pivot()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/pivot/)

{{% note %}}
We're continually optimizing Flux and this list may not represent its current state.
{{% /note %}}

## Balance time range and data precision
To ensure queries are performant, balance the time range and the precision of your data.
For example, if you query data stored every second and request six months worth of data,
results would include ≈15.5 million points per series.  Depending on the [cardinality](https://docs.influxdata.com/influxdb/cloud/reference/glossary/#series-cardinality) (series count returned after your `filter()` function/s) of the query, this can quickly become many billions of points.
Flux must store these points in memory to generate a response.  A Flux user can improve upon this behavior when using [pushdown functions](https://docs.influxdata.com/influxdb/cloud/query-data/optimize-queries/#pushdown-functions) in [InfluxCloud](https://docs.influxdata.com/influxdb/cloud/).

To query data over large periods of time, create a task to [downsample data](/influxdb/cloud/process-data/common-tasks/downsample-data/), and then query the downsampled data instead.
