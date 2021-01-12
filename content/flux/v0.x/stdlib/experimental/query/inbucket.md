---
title: query.inBucket() function
description: >
  The `query.inBucket()` function queries data from a specified bucket within given
  time bounds, filters data by measurement, field, and optional predicate expressions.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/inbucket/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/inbucket/
menu:
  flux_0_x_ref:
    name: query.inBucket
    parent: Query
weight: 401
introduced: 0.60.0
---

The `query.inBucket()` function queries data from a specified bucket within given
time bounds, filters data by measurement, field, and optional predicate expressions.

_**Function type:** Input_

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

### bucket
The name of the bucket to query.

_**Data type:** String_

### start
The earliest time to include in results.
Results **include** points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

_**Data type:** Duration | Time | Integer_

### stop
The latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.
Defaults to `now()`.

_**Data type:** Duration | Time | Integer_

### measurement
The name of the measurement to filter by.
Must be an exact string match.

_**Data type:** String_

### fields
Fields to filter by.
Must be exact string matches.

_**Data type:** Array of strings_

### predicate
A single argument function that evaluates true or false.
Records are passed to the function.
Those that evaluate to `true` are included in the output tables.
Records that evaluate to `null` or `false` are not included in the output tables.
Default is `(r) => true`.

_**Data type:** Function_

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
[filter()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/)  
[query.filterFields()](/influxdb/v2.0/reference/flux/stdlib/experimental/query/filterfields/)  
[query.filterMeasurement()](/influxdb/v2.0/reference/flux/stdlib/experimental/query/filtermeasurement/)  
[query.fromRange()](/influxdb/v2.0/reference/flux/stdlib/experimental/query/fromrange/)  
