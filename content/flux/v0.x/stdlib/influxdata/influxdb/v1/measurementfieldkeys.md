---
title: v1.measurementFieldKeys() function
description: >
  `v1.measurementFieldKeys()` returns a list of fields in a measurement.
menu:
  flux_0_x_ref:
    name: v1.measurementFieldKeys
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/measurementFieldKeys
weight: 301
flux/v0.x/tags: [metadata]
deprecated: 0.88.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementfieldkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementfieldkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurementfieldkeys/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
prepend:
  block: warn
  content: |
    #### Deprecated
    `v1.measurementFieldKeys()` was deprecated in **Flux v0.88.0** in favor of
    [`schema.measurementFieldKeys()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurementfieldkeys/).
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

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L371-L371

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.measurementFieldKeys()` returns a list of fields in a measurement.

Results include a single table with a single column, `_value`.

##### Function type signature

```js
(bucket: string, measurement: A, ?start: B, ?stop: C) => stream[D] where A: Equatable, D: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

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

