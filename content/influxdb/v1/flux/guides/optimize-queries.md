---
title: Optimize Flux queries
description: >
  Optimize your Flux queries to reduce their memory and compute (CPU) requirements.
weight: 30
menu:
  influxdb_v1:
    name: Optimize queries
    parent: Query with Flux
canonical: /influxdb/v2/query-data/optimize-queries/
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

**Pushdowns** are functions or function combinations that push data operations
to the underlying data source rather than operating on data in memory.
Start queries with pushdowns to improve query performance. Once a non-pushdown
function runs, Flux pulls data into memory and runs all subsequent operations there.

#### Pushdown functions and function combinations

The following pushdowns are supported in InfluxDB OSS 1.11+.

| Functions                      |         Supported         |
| :----------------------------- | :-----------------------: |
| **count()**                    | {{< icon "check" "v2" >}} |
| **drop()**                     | {{< icon "check" "v2" >}} |
| **duplicate()**                | {{< icon "check" "v2" >}} |
| **filter()** {{% req " \*" %}} | {{< icon "check" "v2" >}} |
| **fill()**                     | {{< icon "check" "v2" >}} |
| **first()**                    | {{< icon "check" "v2" >}} |
| **group()**                    | {{< icon "check" "v2" >}} |
| **keep()**                     | {{< icon "check" "v2" >}} |
| **last()**                     | {{< icon "check" "v2" >}} |
| **max()**                      | {{< icon "check" "v2" >}} |
| **mean()**                     | {{< icon "check" "v2" >}} |
| **min()**                      | {{< icon "check" "v2" >}} |
| **range()**                    | {{< icon "check" "v2" >}} |
| **rename()**                   | {{< icon "check" "v2" >}} |
| **sum()**                      | {{< icon "check" "v2" >}} |
| **window()**                   | {{< icon "check" "v2" >}} |
| _Function combinations_        |                           |
| **group()** \|> **max()**      | {{< icon "check" "v2" >}} |
| **group()** \|> **min()**      | {{< icon "check" "v2" >}} |
| **window()** \|> **count()**   | {{< icon "check" "v2" >}} |
| **window()** \|> **first()**   | {{< icon "check" "v2" >}} |
| **window()** \|> **last()**    | {{< icon "check" "v2" >}} |
| **window()** \|> **max()**     | {{< icon "check" "v2" >}} |
| **window()** \|> **min()**     | {{< icon "check" "v2" >}} |
| **window()** \|> **sum()**     | {{< icon "check" "v2" >}} |

{{% caption %}}
{{< req "\*" >}} **filter()** only pushes down when all parameter values are static.
See [Avoid processing filters inline](#avoid-processing-filters-inline).
{{% /caption %}}

Use pushdown functions and function combinations at the beginning of your query.
Once a non-pushdown function runs, Flux pulls data into memory and runs all
subsequent operations there.

##### Pushdown functions in use

```js
from(bucket: "db/rp")
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

For example, the following query uses [Chronograf dashboard template variables](/chronograf/v1/guides/dashboard-template-variables/)
and string concatenation to define a region to filter by.
Because `filter()` uses string concatenation inline, it can't push its operation
to the underlying data source and loads all data returned from `range()` into memory.

```js
from(bucket: "db/rp")
    |> range(start: -1h)                      
    |> filter(fn: (r) => r.region == v.provider + v.region)
```

To dynamically set filters and maintain the pushdown ability of the `filter()` function,
use variables to define filter values outside of `filter()`:

```js
region = v.provider + v.region

from(bucket: "db/rp")
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

- [map()](/flux/v0/stdlib/universe/map/)
- [reduce()](/flux/v0/stdlib/universe/reduce/)
- [join()](/flux/v0/stdlib/universe/join/)
- [union()](/flux/v0/stdlib/universe/union/)
- [pivot()](/flux/v0/stdlib/universe/pivot/)

## Use set() instead of map() when possible

[`set()`](/flux/v0/stdlib/universe/set/),
[`experimental.set()`](/flux/v0/stdlib/experimental/set/),
and [`map`](/flux/v0/stdlib/universe/map/)
can each set column values in data, however **set** functions have performance
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
    |> set(key: "foo", value: "bar")
```

#### Dynamically set a column value using existing row data

```js
data
    |> map(fn: (r) => ({ r with foo: r.bar }))
```

## Balance time range and data precision

To ensure queries are performant, balance the time range and the precision of your data.
For example, if you query data stored every second and request six months worth of data,
results would include ≈15.5 million points per series.
Depending on the number of series returned after `filter()`([cardinality](/influxdb/v1/concepts/glossary/#series-cardinality)),
this can quickly become many billions of points.
Flux must store these points in memory to generate a response.
Use [pushdowns](#pushdown-functions-and-function-combinations) to optimize how
many points are stored in memory.

## Measure query performance with Flux profilers

Use the [Flux Profiler package](/flux/v0/stdlib/profiler/)
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

For more information about Flux profilers, see the [Flux Profiler package](/flux/v0/stdlib/profiler/).
