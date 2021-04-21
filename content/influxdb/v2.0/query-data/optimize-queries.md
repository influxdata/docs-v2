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
  - [Avoid processing filters inline](#avoid-processing-filters-inline)
- [Avoid short window durations](#avoid-short-window-durations)
- [Use "heavy" functions sparingly](#use-heavy-functions-sparingly)
- [Use set() instead of map() when possible](#use-set-instead-of-map-when-possible)
- [Balance time range and data precision](#balance-time-range-and-data-precision)
- [Measure query performance with Flux profilers](#measure-query-performance-with-flux-profilers)

## Start queries with pushdowns
**Pushdowns** are functions or function combinations that push data operations to the underlying data source rather than operating on data in memory. Start queries with pushdowns to improve query performance. Once a non-pushdown function runs, Flux pulls data into memory and runs all subsequent operations there.
#### Pushdown functions and function combinations
Most pushdowns are supported when querying an InfluxDB 2.0 or InfluxDB Cloud data source. As shown in the following table, a handful of pushdowns are not supported in InfluxDB 2.0.

| Functions                      | InfluxDB 2.0         | InfluxDB Cloud       |
|:---------                      |:------------:        |:--------------:      |
| **count()**                    | {{< icon "check" >}} | {{< icon "check" >}} |
| **drop()**                     | {{< icon "check" >}} | {{< icon "check" >}} |
| **duplicate()**                | {{< icon "check" >}} | {{< icon "check" >}} |
| **filter()** {{% req " \*" %}} | {{< icon "check" >}} | {{< icon "check" >}} |
| **fill()**                     | {{< icon "check" >}} | {{< icon "check" >}} |
| **first()**                    | {{< icon "check" >}} | {{< icon "check" >}} |
| **keep()**                     | {{< icon "check" >}} | {{< icon "check" >}} |
| **last()**                     | {{< icon "check" >}} | {{< icon "check" >}} |
| **max()**                      | {{< icon "check" >}} | {{< icon "check" >}} |
| **mean()**                     | {{< icon "check" >}} | {{< icon "check" >}} |
| **min()**                      | {{< icon "check" >}} | {{< icon "check" >}} |
| **range()**                    | {{< icon "check" >}} | {{< icon "check" >}} |
| **rename()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| **sum()**                      | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()**                   | {{< icon "check" >}} | {{< icon "check" >}} |
| _Function combinations_ |||
| **group()** \|> **count()**    |                      | {{< icon "check" >}} |
| **group()** \|> **first()**    |                      | {{< icon "check" >}} |
| **group()** \|> **last()**     |                      | {{< icon "check" >}} |
| **group()** \|> **max()**      |                      | {{< icon "check" >}} |
| **group()** \|> **min()**      |                      | {{< icon "check" >}} |
| **group()** \|> **sum()**      |                      | {{< icon "check" >}} |
| **window()** \|> **count()**   | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **first()**   | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **last()**    | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **max()**     | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **min()**     | {{< icon "check" >}} | {{< icon "check" >}} |
| **window()** \|> **sum()**     | {{< icon "check" >}} | {{< icon "check" >}} |

{{% caption %}}
{{< req "\*" >}} **filter()** only pushes down when all parameter values are static.
See [Avoid processing filters inline](#avoid-processing-filters-inline).
{{% /caption %}}

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

### Avoid processing filters inline
Avoid using mathematic operations or string manipulation inline to define data filters.
Processing filter values inline prevents `filter()` from pushing its operation down
to the underlying data source, so data returned by the
previous function loads into memory.
This often results in a significant performance hit.

For example, the following query uses [dashboard variables](/influxdb/v2.0/visualize-data/variables/)
and string concatenation to define a region to filter by.
Because `filter()` uses string concatenation inline, it can't push its operation
to the underlying data source and loads all data returned from `range()` into memory.

```js
from(bucket: "example-bucket")
  |> range(start: -1h)                      
  |> filter(fn: (r) => r.region == v.provider + v.region)
```

To dynamically set filters and maintain the pushdown ability of the `filter()` function,
use variables to define filter values outside of `filter()`:

```js
region = v.provider + v.region

from(bucket: "example-bucket")
  |> range(start: -1h)                      
  |> filter(fn: (r) => r.region == region)
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
- [join()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/join/)
- [union()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/union/)
- [pivot()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot/)

{{% note %}}
We're continually optimizing Flux and this list may not represent its current state.
{{% /note %}}

## Use set() instead of map() when possible
[`set()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/),
[`experimental.set()`](/influxdb/v2.0/reference/flux/stdlib/experimental/set/),
and [`map`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/)
can each set columns value in data, however **set** functions have performance
advantages over `map()`.

Use the following guidelines to determine which to use:

- If setting a column value to a predefined, static value, use `set()` or `experimental.set()`.
- If dynamically setting a column value using **existing row data**, use `map()`.

#### Set a column value to a static value
The following queries are functionally the same, but using `set()` is more performant than using `map()`.

```js
data
  |> map(fn: (r) => ({ r with foo: "bar" }))

// Recommended
data
  |> set(key: "foo", as: "bar" }))
```

#### Dynamically set a column value using existing row data
```js
data
  |> map(fn: (r) => ({ r with foo: r.bar }))
```

## Balance time range and data precision
To ensure queries are performant, balance the time range and the precision of your data.
For example, if you query data stored every second and request six months worth of data,
results would include ≈15.5 million points per series.  Depending on the number of series returned after `filter()`([cardinality](/influxdb/v2.0/reference/glossary/#series-cardinality)), this can quickly become many billions of points.
Flux must store these points in memory to generate a response. Use [pushdowns](#pushdown-functions-and-function-combinations) to optimize how many points are stored in memory.

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
