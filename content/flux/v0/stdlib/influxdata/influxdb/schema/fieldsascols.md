---
title: schema.fieldsAsCols() function
description: >
  `schema.fieldsAsCols()` is a special application of `pivot()` that pivots input data
  on `_field` and `_time` columns to align fields within each input table that
  have the same timestamp.
menu:
  flux_v0_ref:
    name: schema.fieldsAsCols
    parent: influxdata/influxdb/schema
    identifier: influxdata/influxdb/schema/fieldsAsCols
weight: 301
flux/v0.x/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/schema/schema.flux#L47-L49

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`schema.fieldsAsCols()` is a special application of `pivot()` that pivots input data
on `_field` and `_time` columns to align fields within each input table that
have the same timestamp.



##### Function type signature

```js
(<-tables: stream[A]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Pivot InfluxDB fields into columns

```js
import "influxdata/influxdb/schema"

data
    |> schema.fieldsAsCols()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *_measurement | *loc    | *_field | _value  |
| -------------------- | ------------- | ------- | ------- | ------- |
| 2021-01-01T12:00:00Z | m             | Seattle | hum     | 89.2    |
| 2021-01-02T12:00:00Z | m             | Seattle | hum     | 90.5    |
| 2021-01-03T12:00:00Z | m             | Seattle | hum     | 81.0    |

| _time                | *_measurement | *loc    | *_field | _value  |
| -------------------- | ------------- | ------- | ------- | ------- |
| 2021-01-01T12:00:00Z | m             | Seattle | temp    | 73.1    |
| 2021-01-02T12:00:00Z | m             | Seattle | temp    | 68.2    |
| 2021-01-03T12:00:00Z | m             | Seattle | temp    | 61.4    |


#### Output data

| _time                | *_measurement | *loc    | hum  | temp  |
| -------------------- | ------------- | ------- | ---- | ----- |
| 2021-01-01T12:00:00Z | m             | Seattle | 89.2 | 73.1  |
| 2021-01-02T12:00:00Z | m             | Seattle | 90.5 | 68.2  |
| 2021-01-03T12:00:00Z | m             | Seattle | 81.0 | 61.4  |

{{% /expand %}}
{{< /expand-wrapper >}}
