---
title: query.fromRange() function
description: >
  `query.fromRange()` returns all data from a specified bucket within given time bounds.
menu:
  flux_v0_ref:
    name: query.fromRange
    parent: experimental/query
    identifier: experimental/query/fromRange
weight: 201
flux/v0/tags: [transformations, filters]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/query/from.flux#L40-L42

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`query.fromRange()` returns all data from a specified bucket within given time bounds.



##### Function type signature

```js
(
    bucket: string,
    start: A,
    ?stop: B,
) => stream[{
    C with
    _value: D,
    _time: time,
    _stop: time,
    _start: time,
    _measurement: string,
    _field: string,
}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket
({{< req >}})
InfluxDB bucket name.



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


## Examples

### Query data from InfluxDB in a specified time range

```js
import "experimental/query"

query.fromRange(bucket: "example-bucket", start: -1h)

```

