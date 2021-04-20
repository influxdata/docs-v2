---
title: Optimize Flux queries
description: >
  Optimize your Flux queries to reduce their memory and compute (CPU) requirements.
weight: 104
menu:
  influxdb_2_0:
    name: Optimize queries
    parent: Query data
influxdb/v2.0/tags: [query]
---

Optimize your Flux queries to reduce their memory and compute (CPU) requirements.

- [Start queries with pushdowns](#start-queries-with-pushdowns)
- [Avoid short window durations](#avoid-short-window-durations)
- [Use "heavy" functions sparingly](#use-heavy-functions-sparingly)
- [Balance time range and data precision](#balance-time-range-and-data-precision)
- [Measure query performance with Flux profilers](#measure-query-performance-with-flux-profilers)

## Start queries with pushdowns
Some Flux functions and function combinations can push their data manipulation down
to the underlying data source rather than storing and manipulating data in memory.
These are known as "pushdowns" and using them correctly can greatly improve query performance.

#### Pushdown functions and function combinations
Pushdown functionality depends on the queried data source.

| Functions                    | InfluxDB 2.0         | InfluxDB Cloud       |
|:---------                    |:------------:        |:--------------:      |
| **range()**                  | {{< icon "check" >}} | {{< icon "check" >}} |
| **filter()**                 | {{< icon "check" >}} | {{< icon "check" >}} |
| **count()**                  | {{< icon "check" >}} | {{< icon "check" >}} |
| **sum()**                    | {{< icon "check" >}} | {{< icon "check" >}} |
| **first()**                  | {{< icon "check" >}} | {{< icon "check" >}} |
| **last()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| **min()**                    | {{< icon "check" >}} | {{< icon "check" >}} |
| **max()**                    | {{< icon "check" >}} | {{< icon "check" >}} |
| **mean()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| **fill()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| **keep()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| **drop()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| **rename()**                 | {{< icon "check" >}} | {{< icon "check" >}} |
| **duplicate()**              | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()**                 | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **count()** | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **sum()**   | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **first()** | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **last()**  | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **min()**   | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **max()**   | {{< icon "check" >}} | {{< icon "check" >}} |
| **group()** \|> **count()**  |                      | {{< icon "check" >}} |
| **group()** \|> **sum()**    |                      | {{< icon "check" >}} |
| **group()** \|> **first()**  |                      | {{< icon "check" >}} |
| **group()** \|> **last()**   |                      | {{< icon "check" >}} |
| **group()** \|> **min()**    |                      | {{< icon "check" >}} |
| **group()** \|> **max()**    |                      | {{< icon "check" >}} |


Use pushdown functions and function combinations at the beginning of your query.
Once a non-pushdown function runs, Flux pulls data into memory and runs all
subsequent operations there.

##### Pushdown functions in use
```js
from(bucket: "example-bucket")
  |> range(start: -1h)                       //
  |> filter(fn: (r) => r.sensor == "abc123") //
  |> group(columns: ["_field", "host"])      // Pushed to the data source
  |> aggregateWindow(every: 5m, fn: max)     //
  |> filter(fn: (r) => r._value >= 90.0)     //

  |> top(n: 10)                              // Run in memory
```

## Avoid short window durations
Windowing (grouping data based on time intervals) is commonly used to aggregate and downsample data.
Increase performance by avoiding short window durations.
More windows require more compute power to evaluate which window each row should be assigned to.
Reasonable window durations depend on the total time range queried.

## Use "heavy" functions sparingly
The following functions use more memory or CPU than others.
Consider their necessity in your data processing before using them:

- [map()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/)
- [reduce()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/)
- [window()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/)
- [join()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/join/)
- [union()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/union/)
- [pivot()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot/)

{{% note %}}
We're continually optimizing Flux and this list may not represent its current state.
{{% /note %}}

## Balance time range and data precision
To ensure queries are performant, balance the time range and the precision of your data.
For example, if you query data stored every second and request six months worth of data,
results would include ≈15.5 million points per series.  Depending on the number of series returned after `filter()`([cardinality](/influxdb/v2.0/reference/glossary/#series-cardinality)), this can quickly become many billions of points.
Flux must store these points in memory to generate a response.  Use [pushdowns](#pushdown-functions-and-function-combinations) to optimize how many points are stored in memory.

To query data over large periods of time, create a task to [downsample data](/influxdb/v2.0/process-data/common-tasks/downsample-data/), and then query the downsampled data instead.

## Measure query performance with Flux profilers
Use the [Flux Profiler package](/influxdb/v2.0/reference/flux/stdlib/profiler/)
to measure query performance and append performance metrics to your query output.
The following Flux profilers are available:

- **query**: provides statistics about the execution of an entire Flux script.
- **operator**: provides statistics about each operation in a query.

Import the `profiler` package and enable profilers with the `profile.enabledProfilers` option.

```js
import "profiler"

option profiler.enabledProfilers = ["query", "operator"]

// Query to profile
```

For more information about Flux profilers, see the [Flux Profiler package](/influxdb/v2.0/reference/flux/stdlib/profiler/).
