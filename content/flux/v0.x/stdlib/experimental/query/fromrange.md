---
title: query.fromRange() function
seotitle: Experimental query.fromRange() function
description: >
  The `query.fromRange()` function returns all data from a specified bucket within
  given time bounds.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/fromrange/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/fromrange/
menu:
  flux_0_x_ref:
    name: query.fromRange
    parent: query
weight: 401
flux/v0.x/tags: [inputs]
introduced: 0.60.0
---

The `query.fromRange()` function returns all data from a specified bucket within
given time bounds.

_**Function type:** Input_

```js
import "experimental/query"

query.fromRange(
  bucket: "example-bucket",
  start: -1h,
  stop: now()
)
```

## Parameters

### bucket {data-type="string"}
The name of the bucket to query.

### start {data-type="duration, time, int"}
The earliest time to include in results.
Results **include** points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`..
Durations are relative to `now()`.

### stop {data-type="duration, time, int"}
The latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.
Defaults to `now()`.

## Examples

```js
import "experimental/query"

query.fromRange(
  bucket: "example-bucket",
  start: 2020-01-01T00:00:00Z
)
```

## Function definition
```js
package query

fromRange = (bucket, start, stop=now()) =>
  from(bucket: bucket)
    |> range(start: start, stop: stop)
```

_**Used functions:**_  
[from()](/flux/v0.x/stdlib/universe/from/)  
[range()](/flux/v0.x/stdlib/universe/range/)  
