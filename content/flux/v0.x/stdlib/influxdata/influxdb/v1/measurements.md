---
title: v1.measurements() function
description: >
  `v1.measurements()` returns a list of measurements in a specific bucket.
menu:
  flux_0_x_ref:
    name: v1.measurements
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/measurements
weight: 301
flux/v0.x/tags: [metadata]
deprecated: 0.88.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurements/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurements/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurements/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-measurements, SHOW MEASUREMENTS in InfluxQL
prepend:
  block: warn
  content: |
    #### Deprecated
    `v1.measurements()` was deprecated in **Flux v0.88.0** in favor of
    [`schema.measurements()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurements/).
append:
  block: warn
  content: |
    #### Not supported in the Flux REPL
    `v1` functions can retrieve schema information when executed within
    the context of InfluxDB, but not from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L397-L397

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.measurements()` returns a list of measurements in a specific bucket.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(bucket: string, ?start: A, ?stop: B) => stream[C] where C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

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

