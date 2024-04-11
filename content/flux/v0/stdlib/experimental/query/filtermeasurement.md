---
title: query.filterMeasurement() function
description: >
  `query.filterMeasurement()` filters input data by measurement.
menu:
  flux_v0_ref:
    name: query.filterMeasurement
    parent: experimental/query
    identifier: experimental/query/filterMeasurement
weight: 201
flux/v0/tags: [transformations, filters]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/query/from.flux#L62-L63

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`query.filterMeasurement()` filters input data by measurement.



##### Function type signature

```js
(<-table: stream[{B with _measurement: C}], measurement: A) => stream[{B with _measurement: C}] where A: Equatable, C: Equatable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### measurement
({{< req >}})
InfluxDB measurement name to filter by.



### table

Input data. Default is piped-forward data (`<-`).




## Examples

### Query data from InfluxDB in a specific measurement

```js
import "experimental/query"

query.fromRange(bucket: "example-bucket", start: -1h)
    |> query.filterMeasurement(measurement: "example-measurement")

```

