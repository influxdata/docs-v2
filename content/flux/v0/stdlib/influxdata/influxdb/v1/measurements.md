---
title: v1.measurements() function
description: >
  `v1.measurements()` returns a list of measurements in a specific bucket.
menu:
  flux_v0_ref:
    name: v1.measurements
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/measurements
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

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L397-L398

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.measurements()` returns a list of measurements in a specific bucket.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(bucket: string, ?start: A, ?stop: B) => stream[C] where C: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket
({{< req >}})
Bucket to retrieve measurements from.



### start

Oldest time to include in results. Default is `-30d`.



### stop

Newest time include in results.
The stop time is exclusive, meaning values with a time equal to stop time are excluded from the results.
Default is `now()`.




## Examples

### Return a list of measurements in an InfluxDB bucket

```js
import "influxdata/influxdb/schema"

schema.measurements(bucket: "example-bucket")

```

