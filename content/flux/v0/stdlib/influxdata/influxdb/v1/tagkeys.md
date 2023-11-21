---
title: v1.tagKeys() function
description: >
  `v1.tagKeys()` returns a list of tag keys for all series that match the `predicate`.
menu:
  flux_v0_ref:
    name: v1.tagKeys
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/tagKeys
weight: 301
flux/v0/tags: [metadata]
deprecated: 0.88.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L272-L272

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.tagKeys()` returns a list of tag keys for all series that match the `predicate`.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(
    bucket: string,
    ?predicate: (
        r: {
            A with
            _value: B,
            _time: time,
            _stop: time,
            _start: time,
            _measurement: string,
            _field: string,
        },
    ) => bool,
    ?start: C,
    ?stop: D,
) => stream[E] where E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### bucket
({{< req >}})
Bucket to return tag keys from.



### predicate

Predicate function that filters tag keys.
Default is `(r) => true`.



### start

Oldest time to include in results. Default is `-30d`.



### stop

Newest time include in results.
The stop time is exclusive, meaning values with a time equal to stop time are excluded from the results.
Default is `now()`.

Relative start times are defined using negative durations.
Negative durations are relative to `now()`.
Absolute start times are defined using time values.


## Examples

### Query tag keys in an InfluxDB bucket

```js
import "influxdata/influxdb/v1"

v1.tagKeys(bucket: "example-bucket")

```

