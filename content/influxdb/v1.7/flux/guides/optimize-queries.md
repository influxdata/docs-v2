---
title: Optimize Flux queries
description: >
  Optimize your Flux queries to reduce their memory and compute (CPU) requirements.
weight: 30
menu:
  influxdb_1_7:
    name: Optimize queries
    parent: Query with Flux
canonical: /{{< latest "influxdb" "v2" >}}/query-data/flux/optimize-queries/
v2: /influxdb/v2.0/query-data/flux/optimize-queries/
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
- [range()](/{{< latest "flux" >}}/stdlib/universe/range/)
- [filter()](/{{< latest "flux" >}}/stdlib/universe/filter/)
- [group()](/{{< latest "flux" >}}/stdlib/universe/group/)

Use pushdown functions at the beginning of your query.
Once a non-pushdown function runs, Flux pulls data into memory and runs all
subsequent operations there.

##### Pushdown functions in use
```js
from(bucket: "db/rp")
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

- [map()](/{{< latest "flux" >}}/stdlib/universe/map/)
- [reduce()](/{{< latest "flux" >}}/stdlib/universe/reduce/)
- [window()](/{{< latest "flux" >}}/stdlib/universe/window/)
- [join()](/{{< latest "flux" >}}/stdlib/universe/join/)
- [union()](/{{< latest "flux" >}}/stdlib/universe/union/)
- [pivot()](/{{< latest "flux" >}}/stdlib/universe/pivot/)

{{% note %}}
We're continually optimizing Flux and this list may not represent its current state.
{{% /note %}}

## Balance time range and data precision
To ensure queries are performant, balance the time range and the precision of your data.
For example, if you query data stored every second and request six months worth of data,
results will include a minimum of ≈15.5 million points.
Flux must store these points in memory to generate a response.

To query data over large periods of time, create a [continuous query](/influxdb/v1.7/query_language/continuous_queries/)
to downsample data, and then query the downsampled data instead.
