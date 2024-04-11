---
title: v1.measurementTagValues() function
description: >
  `v1.measurementTagValues()` returns a list of tag values for a specific measurement.
menu:
  flux_v0_ref:
    name: v1.measurementTagValues
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/measurementTagValues
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

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L240-L240

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.measurementTagValues()` returns a list of tag values for a specific measurement.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(
    bucket: string,
    measurement: A,
    tag: string,
    ?start: B,
    ?stop: C,
) => stream[D] where A: Equatable, D: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket
({{< req >}})
Bucket to return tag values from for a specific measurement.



### measurement
({{< req >}})
Measurement to return tag values from.



### tag
({{< req >}})
Tag to return all unique values from.



### start

Oldest time to include in results. Default is `-30d`.



### stop

Newest time include in results.
The stop time is exclusive, meaning values with a time equal to stop time are excluded from the results.
Default is `now()`.




## Examples

### Query unique tag values from an InfluxDB measurement

```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
    bucket: "example-bucket",
    measurement: "example-measurement",
    tag: "example-tag",
)

```

