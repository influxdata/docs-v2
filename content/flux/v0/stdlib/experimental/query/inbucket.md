---
title: query.inBucket() function
description: >
  `query.inBucket()` queries data from a specified InfluxDB bucket within given time bounds,
  filters data by measurement, field, and optional predicate expressions.
menu:
  flux_v0_ref:
    name: query.inBucket
    parent: experimental/query
    identifier: experimental/query/inBucket
weight: 201
flux/v0.x/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/query/from.flux#L133-L144

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`query.inBucket()` queries data from a specified InfluxDB bucket within given time bounds,
filters data by measurement, field, and optional predicate expressions.



##### Function type signature

```js
(
    bucket: string,
    measurement: A,
    start: B,
    ?fields: [string],
    ?predicate: (
        r: {
            C with
            _value: D,
            _time: time,
            _stop: time,
            _start: time,
            _measurement: string,
            _field: string,
        },
    ) => bool,
    ?stop: E,
) => stream[{
    C with
    _value: D,
    _time: time,
    _stop: time,
    _start: time,
    _measurement: string,
    _field: string,
}] where A: Equatable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### bucket
({{< req >}})
InfluxDB bucket name.



### measurement
({{< req >}})
InfluxDB measurement name to filter by.



### start
({{< req >}})
Earliest time to include in results.

Results include points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop

Latest time to include in results. Default is `now()`.

Results exclude points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### fields

Fields to filter by. Default is `[]`.



### predicate

Predicate function that evaluates column values and returns `true` or `false`.
Default is `(r) => true`.

Records (`r`) are passed to the function.
Those that evaluate to `true` are included in the output tables.
Records that evaluate to null or `false` are not included in the output tables.


## Examples

### Query specific fields in a measurement from InfluxDB

```js
import "experimental/query"

query.inBucket(
    bucket: "example-buckt",
    start: -1h,
    measurement: "mem",
    fields: ["field1", "field2"],
    predicate: (r) => r.host == "host1",
)

```

