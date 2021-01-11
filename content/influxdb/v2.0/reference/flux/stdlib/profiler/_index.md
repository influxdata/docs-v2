---
title: Flux Profiler package
list_title: Profiler package
description: >
  The Flux Profiler package provides performance profiling tools for Flux queries and operations.
  Import the `profiler` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/profiler/
  - /influxdb/cloud/reference/flux/stdlib/profiler/
menu:
  influxdb_2_0_ref:
    name: Profiler
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, optimize, package]
related:
  - /influxdb/v2.0/query-data/optimize-queries/
---

The Flux Profiler package provides performance profiling tools for Flux queries and operations.
Import the `profiler` package:

```js
import "profiler"
```

## Options
The Profiler package includes the following options:

### enabledProfilers
Enable Flux profilers.

_**Data type:** Array of strings_

```js
import "profiler"

option profiler.enabledProfilers = ["query", "operator"]

// Query to profile
```

## Available profilers
- [query](#query)
- [operator](#operator)

### query
The `query` profiler provides statistics about the execution of an entire Flux script.
When enabled, results returned by [`yield()`](/influxdb/v2.0/reference/flux/stdlib/built-in/outputs/yield/)
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
[Operations executed in the storage tier](/influxdb/v2.0/query-data/optimize-queries/#start-queries-with-pushdown-functions)
return as a single operation.
When the `operator` profile is enabled, results returned by [`yield()`](/influxdb/v2.0/reference/flux/stdlib/built-in/outputs/yield/)
include a table with a row for each operation and the following columns:

- **Type:** operation type
- **Label:** operation name
- **Count:** total number of times the operation executed
- **MinDuration:** minimum duration of the operation in nanoseconds
- **MaxDuration:** maximum duration of the operation in nanoseconds
- **DurationSum:** total duration of all operation executions in nanoseconds
- **MeanDuration:** average duration of all operation executions in nanoseconds
