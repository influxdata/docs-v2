---
title: schema.measurementFieldKeys() function
description: >
  `schema.measurementFieldKeys()` returns a list of fields in a measurement.
menu:
  flux_v0_ref:
    name: schema.measurementFieldKeys
    parent: influxdata/influxdb/schema
    identifier: influxdata/influxdb/schema/measurementFieldKeys
weight: 301
flux/v0/tags: [metadata]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/schema/schema.flux#L286-L292

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`schema.measurementFieldKeys()` returns a list of fields in a measurement.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(bucket: string, measurement: A, ?start: B, ?stop: C) => stream[D] where A: Equatable, D: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket
({{< req >}})
Bucket to retrieve field keys from.



### measurement
({{< req >}})
Measurement to list field keys from.



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

### Query field keys from an InfluxDB measurement

```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(bucket: "example-bucket", measurement: "example-measurement")

```

