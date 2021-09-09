---
title: Flux profiler package
list_title: profiler package
description: >
  The Flux `profiler` package provides performance profiling tools for Flux queries and operations.
  Import the `profiler` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/profiler/
  - /influxdb/cloud/reference/flux/stdlib/profiler/
menu:
  flux_0_x_ref:
    name: profiler
    parent: Standard library
weight: 11
flux/v0.x/tags: [functions, optimize, package]
related:
  - /{{< latest "influxdb" >}}/query-data/optimize-queries/
introduced: 0.82.0
---

The Flux `profiler` package provides performance profiling tools for Flux queries and operations.
Import the `profiler` package:

```js
import "profiler"
```

## Options
The `profiler` package includes the following options:

```js
import "profiler"

option profiler.enabledProfilers = ["query", "operator"]
```

### enabledProfilers {data-type="array of strings"}
List of Flux profilers to enable.

## Available profilers
- [query](#query)
- [operator](#operator)

### query
The `query` profiler provides statistics about the execution of an entire Flux script.
When enabled, results returned by [`yield()`](/flux/v0.x/stdlib/universe/yield/)
include a table with the following columns:

- **TotalDuration**: total query duration in nanoseconds.
- **CompileDuration**: number of nanoseconds spent compiling the query.
- **QueueDuration**: number of nanoseconds spent queueing.
- **RequeueDuration**: number fo nanoseconds spent requeueing.
- **PlanDuration**: number of nanoseconds spent planning the query.
- **ExecuteDuration**: number of nanoseconds spent executing the query.
- **Concurrency**: number of goroutines allocated to process the query.
- **MaxAllocated**: maximum number of bytes the query allocated.
- **TotalAllocated**: total number of bytes the query allocated (includes memory that was freed and then used again).
- **RuntimeErrors**: error messages returned during query execution.
- **flux/query-plan**: Flux query plan.
- **influxdb/scanned-values**: value scanned by InfluxDB.
- **influxdb/scanned-bytes**: number of bytes scanned by InfluxDB.

### operator
The `operator` profiler output statistics about each operation in a query.
[Operations executed in the storage tier](/influxdb/cloud/query-data/optimize-queries/#start-queries-with-pushdown-functions)
return as a single operation.
When the `operator` profile is enabled, results returned by [`yield()`](/flux/v0.x/stdlib/universe/yield/)
include a table with a row for each operation and the following columns:

- **Type:** operation type
- **Label:** operation name
- **Count:** total number of times the operation executed
- **MinDuration:** minimum duration of the operation in nanoseconds
- **MaxDuration:** maximum duration of the operation in nanoseconds
- **DurationSum:** total duration of all operation executions in nanoseconds
- **MeanDuration:** average duration of all operation executions in nanoseconds
