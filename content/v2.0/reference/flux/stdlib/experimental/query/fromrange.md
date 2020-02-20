---
title: query.fromRange() function
description: >
  The `query.fromRange()` function returns all data from a specified bucket within
  given time bounds.
menu:
  v2_0_ref:
    name: query.fromRange
    parent: Query
weight: 301
---

The `query.fromRange()` function returns all data from a specified bucket within
given time bounds.

_**Function type:** Output_

```js
import "experimental/query"

query.fromRange(
  bucket: "example-bucket",
  start: -1h,
  stop: now()
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
