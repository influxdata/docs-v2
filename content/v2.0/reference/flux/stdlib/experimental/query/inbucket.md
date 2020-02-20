---
title: query.inBucket() function
description: >
  The `query.inBucket()` function queries data from a specified bucket within given
  time bounds, filters data my measurement, field, and other column values.
menu:
  v2_0_ref:
    name: query.inBucket
    parent: Query
weight: 301
---

The `query.inBucket()` function queries data from a specified bucket within given
time bounds, filters data my measurement, field, and other column values.

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
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.

_**Data type:** Duration | Time_

### stop
The latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.
Defaults to `now()`.

_**Data type:** Duration | Time_

### measurement
The name of the measurement to filter by.
Must be an exact string match.

_**Data type:** String_

### fields
Fields to filter by.
Must be exact string matches.

_**Data type:** Array of strings_

### predicate
A single argument predicate function that evaluates true or false.
Records are passed to the function.
Those that evaluate to true are included in the output tables.
Records that evaluate to _null_ or false are not included in the output tables.
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
