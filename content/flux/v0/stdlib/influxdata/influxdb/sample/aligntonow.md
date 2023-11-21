---
title: sample.alignToNow() function
description: >
  `sample.alignToNow()` shifts time values in input data to align the chronological last point to _now_.
menu:
  flux_v0_ref:
    name: sample.alignToNow
    parent: influxdata/influxdb/sample
    identifier: influxdata/influxdb/sample/alignToNow
weight: 301
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/sample/sample.flux#L169-L179

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sample.alignToNow()` shifts time values in input data to align the chronological last point to _now_.

When writing static historical sample datasets to **InfluxDB Cloud**, use `alignToNow()`
to avoid losing sample data with timestamps outside of the retention period
associated with your InfluxDB Cloud account.

Input data must have a `_time` column.

##### Function type signature

```js
(<-tables: stream[A]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Defaults to piped-forward data (`<-`).




## Examples

### Align sample data to now

```js
import "influxdata/influxdb/sample"

sample.data(set: "birdMigration")
    |> sample.alignToNow()

```

