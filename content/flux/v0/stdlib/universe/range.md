---
title: range() function
description: >
  `range()` filters rows based on time bounds.
menu:
  flux_v0_ref:
    name: range
    parent: universe
    identifier: universe/range
weight: 101
flux/v0.x/tags: [transformations, filters]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2108-L2112

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`range()` filters rows based on time bounds.

Input data must have a `_time` column of type time.
Rows with a null value in the `_time` are filtered.
`range()` adds a `_start` column with the value of `start` and a `_stop`
column with the value of `stop`.
`_start` and `_stop` columns are added to the group key.
Each input table’s group key value is modified to fit within the time bounds.
Tables with all rows outside the time bounds are filtered entirely.

##### Function type signature

```js
(<-tables: stream[{C with _time: time}], start: A, ?stop: B) => stream[{C with _time: time, _stop: time, _start: time}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### start
({{< req >}})
Earliest time to include in results.

Results _include_ rows with `_time` values that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop

Latest time to include in results. Default is `now()`.

Results _exclude_ rows with `_time` values that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Query a time range relative to now](#query-a-time-range-relative-to-now)
- [Query an absolute time range](#query-an-absolute-time-range)
- [Query an absolute time range using Unix timestamps](#query-an-absolute-time-range-using-unix-timestamps)

### Query a time range relative to now

```js
from(bucket: "example-bucket")
    |> range(start: -12h)

```


### Query an absolute time range

```js
from(bucket: "example-bucket")
    |> range(start: 2021-05-22T23:30:00Z, stop: 2021-05-23T00:00:00Z)

```


### Query an absolute time range using Unix timestamps

```js
from(bucket: "example-bucket")
    |> range(start: 1621726200, stop: 1621728000)

```

