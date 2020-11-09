---
title: Flux Profiler package
list_title: Profiler package
description: >
  The Flux Profiler package provides performance profiling tools for Flux queries and operations.
  Import the `profiler` package.
menu:
  influxdb_cloud_ref:
    name: Profiler
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, optimize, package]
related:
  - /influxdb/cloud/query-data/optimize-queries/
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

option profiler.enabledProfilers = [""]
```

#### Available profilers

##### query
The `query` profiler provides statistics about the execution of an entire Flux script.
When enabled, results returned by [`yield()`](/influxdb/cloud/reference/flux/stdlib/built-in/outputs/yield/)
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

#### Use the query profiler

Use the query profiler to output statistics about query execution.

```js
import "profiler"

option profiler.enabledProfilers = ["query"]

// ... Query to profile
```
