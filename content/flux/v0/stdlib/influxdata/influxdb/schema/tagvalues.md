---
title: schema.tagValues() function
description: >
  `schema.tagValues()` returns a list of unique values for a given tag.
menu:
  flux_v0_ref:
    name: schema.tagValues
    parent: influxdata/influxdb/schema
    identifier: influxdata/influxdb/schema/tagValues
weight: 301
flux/v0.x/tags: [metadata]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/schema/schema.flux#L84-L96

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`schema.tagValues()` returns a list of unique values for a given tag.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(
    bucket: string,
    tag: string,
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
Bucket to return unique tag values from.



### tag
({{< req >}})
Tag to return unique values from.



### predicate

Predicate function that filters tag values.
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

### Query unique tag values from an InfluxDB bucket

```js
import "influxdata/influxdb/schema"

schema.tagValues(bucket: "example-bucket", tag: "host")

```

