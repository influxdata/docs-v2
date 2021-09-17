---
title: query.inBucket() function
seotitle: Experimental query.inBucket() function
description: >
  The `query.inBucket()` function queries data from a specified bucket within given
  time bounds, filters data by measurement, field, and optional predicate expressions.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/inbucket/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/inbucket/
menu:
  flux_0_x_ref:
    name: query.inBucket
    parent: query
weight: 401
flux/v0.x/tags: [inputs]
introduced: 0.60.0
---

The `query.inBucket()` function queries data from a specified bucket within given
time bounds, filters data by measurement, field, and optional predicate expressions.

```js
import "experimental/query"

query.inBucket(
  bucket: "example-bucket",
  start: -1h,
  stop: now(),
  measurement: "example-measurement",
  fields: ["exampleField1", "exampleField2"],
  predicate: (r) => true
)
```

## Parameters

### bucket {data-type="string"}
The name of the bucket to query.

### start {data-type="duration, time, int"}
The earliest time to include in results.
Results **include** points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop {data-type="duration, time, int"}
The latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.
Defaults to `now()`.

### measurement {data-type="string"}
The name of the measurement to filter by.
Must be an exact string match.

### fields {data-type="array of strings"}
Fields to filter by.
Must be exact string matches.

### predicate {data-type="function"}
A single argument function that evaluates true or false.
Records are passed to the function.
Those that evaluate to `true` are included in the output tables.
Records that evaluate to `null` or `false` are not included in the output tables.
Default is `(r) => true`.

## Examples

##### Query memory data from host1
```js
import "experimental/query"

query.inBucket(
  bucket: "telegraf",
  start: -1h,
  measurement: "mem",
  fields: ["used_percent", "available_percent"],
  predicate: (r) => r.host == "host1"
)
```

## Function definition
```js
package query

inBucket = (
  bucket,
  start,
  stop=now(),
  measurement,  
  fields=[],
  predicate=(r) => true
) =>
  fromRange(bucket: bucket, start: start, stop: stop)
    |> filterMeasurement(measurement)
    |> filter(fn: predicate)
    |> filterFields(fields)
```

_**Used functions:**_  
[filter()](/flux/v0.x/stdlib/universe/filter/)  
[query.filterFields()](/flux/v0.x/stdlib/experimental/query/filterfields/)  
[query.filterMeasurement()](/flux/v0.x/stdlib/experimental/query/filtermeasurement/)  
[query.fromRange()](/flux/v0.x/stdlib/experimental/query/fromrange/)  
