---
title: schema.measurementTagValues() function
description: >
  `schema.measurementTagValues()` returns a list of tag values for a specific measurement.
menu:
  flux_0_x_ref:
    name: schema.measurementTagValues
    parent: influxdata/influxdb/schema
    identifier: influxdata/influxdb/schema/measurementTagValues
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementtagvalues/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurementtagvalues/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagvalues/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-values, SHOW TAG VALUES in InfluxQL
append:
  block: warn
  content: |
    #### Not supported in the Flux REPL
    `schema` functions can retrieve schema information when executed within
    the context of InfluxDB, but not from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/schema/schema.flux#L164-L177

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`schema.measurementTagValues()` returns a list of tag values for a specific measurement.

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

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

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

schema.measurementTagValues(bucket: "example-bucket", measurement: "example-measurement", tag: "example-tag")

```

