---
title: Flux Profiler package
list_title: Profiler package
description: >
  The Flux Profiler package provides performance profiling tools for Flux queries and operations.
  Import the `profiler` package.
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

Each enabled profiler appends a table to the output stream of tables containing
data returned by the profiler.

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
[Operations executed in the storage tier](/influxdb/v2.0/query-data/optimize-queries/#start-queries-with-pushdowns)
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

## Examples

- [Measure query and operator performance for InfluxDB](#measure-query-and-operator-performance-for-influxdb)
- [Measure query and operator performance of array.from()](#measure-query-and-operator-performance-of-arrayfrom)

### Measure query and operator performance for InfluxDB

_The example below uses the [ NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data)._

```js
import "profiler"

option profiler.enabledProfilers = ["query", "operator"]

from(bucket: "noaa")
  |> range(start: 2019-08-17T00:00:00Z, stop: 2019-08-17T00:30:00Z)
  |> filter(fn: (r) =>
    r._measurement == "h2o_feet" and
    r._field == "water_level" and
    r.location == "coyote_creek"
  )
  |> map(fn: (r) => ({ r with
    _value: r._value * 12.0,
    _measurement: "h2o_inches"
  }))
  |> drop(columns: ["_start", "_stop"])
```

#### Output tables

| _time                | _measurement | location     | _field      | _value |
|:-----                |:------------ |:--------     |:------      | ------:|
| 2019-08-17T00:00:00Z | h2o_inches   | coyote_creek | water_level | 97.44  |
| 2019-08-17T00:06:00Z | h2o_inches   | coyote_creek | water_level | 96.06  |
| 2019-08-17T00:12:00Z | h2o_inches   | coyote_creek | water_level | 94.64  |
| 2019-08-17T00:18:00Z | h2o_inches   | coyote_creek | water_level | 93.14  |
| 2019-08-17T00:24:00Z | h2o_inches   | coyote_creek | water_level | 91.62  |

| _measurement   | TotalDuration | CompileDuration | QueueDuration | PlanDuration | RequeueDuration | ExecuteDuration | Concurrency | MaxAllocated | TotalAllocated | RuntimeErrors | flux/query-plan | influxdb/scanned-values | influxdb/scanned-bytes |
|:------------   | -------------:| ---------------:| -------------:| ------------:| ---------------:| ---------------:| -----------:| ------------:| --------------:| -------------:|:--------------- | -----------------------:| ----------------------:|
| profiler/query | 12464554      | 725978          | 17446         | 0            | 0               | 11706028        | 0           | 1728         | 0              |               | "digraph {...}" | 0                       | 0                      |

| _measurement      | Type                                   | Label                     | Count | MinDuration | MaxDuration | DurationSum | MeanDuration |
|:------------      |:----                                   |:-----                     | -----:| -----------:| -----------:| -----------:| ------------:|
| profiler/operator | *universe.schemaMutationTransformation | drop4                     | 1     | 14145       | 14145       | 14145       | 14145        |
| profiler/operator | *universe.mapTransformation            | map3                      | 1     | 250831      | 250831      | 250831      | 250831       |
| profiler/operator | *influxdb.readFilterSource             | merged_ReadRange5_filter2 | 1     | 529282      | 529282      | 529282      | 529282       |

---

### Measure query and operator performance of array.from()
```js
import "profiler"
import "array"

option profiler.enabledProfilers = ["query", "operator"]

arrData = [
  {_time: 2021-01-01T00:00:00Z, _field: "foo", _value: 1.2},
  {_time: 2021-01-02T00:00:00Z, _field: "foo", _value: 2.5},
  {_time: 2021-01-03T00:00:00Z, _field: "foo", _value: 2.6},
  {_time: 2021-01-04T00:00:00Z, _field: "foo", _value: 8.1},
  {_time: 2021-01-05T00:00:00Z, _field: "foo", _value: 4.9}
]

array.from(rows: arrData)
```

#### Output tables

| _time                | _field | _value |
|:-----                |:------:| ------:|
| 2021-01-01T00:00:00Z | foo    | 1.2    |
| 2021-01-02T00:00:00Z | foo    | 2.5    |
| 2021-01-03T00:00:00Z | foo    | 2.6    |
| 2021-01-04T00:00:00Z | foo    | 8.1    |
| 2021-01-05T00:00:00Z | foo    | 4.9    |

| _measurement   | TotalDuration | CompileDuration | QueueDuration | PlanDuration | RequeueDuration | ExecuteDuration | Concurrency | MaxAllocated | TotalAllocated | RuntimeErrors | flux/query-plan                                                        |
| ------------   | -------------:| ---------------:| -------------:| ------------:| ---------------:| ---------------:| -----------:| ------------:| --------------:| -------------:| ---------------:                                                       |
| profiler/query | 6764877       | 582662          | 17621         | 0            | 0               | 6136434         | 0           | 832          | 0              |               | "digraph {...}" |

| _measurement      | Type               | Label       | Count | MinDuration | MaxDuration | DurationSum | MeanDuration |
|:------------      |:----               |:-----       | -----:| -----------:| -----------:| -----------:| ------------ |
| profiler/operator | *array.tableSource | array.from0 | 1     | 56361       | 56361       | 56361       | 56361        |
