---
title: geo.toRows() function
description: >
  `geo.toRows()` pivots fields into columns based on time.
menu:
  flux_v0_ref:
    name: geo.toRows
    parent: experimental/geo
    identifier: experimental/geo/toRows
weight: 201
flux/v0.x/tags: [transformations, geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L548-L550

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.toRows()` pivots fields into columns based on time.

Latitude and longitude should be stored as fields in InfluxDB.
Because most `geo` package transformation functions require rows to have
`lat` and `lon` columns, `lat` and `lot` fields must be pivoted into columns.

##### Function type signature

```js
(<-tables: stream[A]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Pivot lat and lon fields into columns

```js
import "experimental/geo"

data
    |> geo.toRows()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | *_field | _value   |
| -------------------- | ----- | ------- | -------- |
| 2021-01-01T00:00:00Z | a213b | lat     | 14.01433 |
| 2021-01-02T01:00:00Z | a213b | lat     | 13.9228  |
| 2021-01-03T02:00:00Z | a213b | lat     | 15.08433 |

| _time                | *id   | *_field | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | a213b | lon     | 39.7515 |
| 2021-01-02T01:00:00Z | a213b | lon     | 38.3527 |
| 2021-01-03T02:00:00Z | a213b | lon     | 36.9978 |


#### Output data

| _time                | *id   | lat      | lon     |
| -------------------- | ----- | -------- | ------- |
| 2021-01-01T00:00:00Z | a213b | 14.01433 | 39.7515 |
| 2021-01-02T01:00:00Z | a213b | 13.9228  | 38.3527 |
| 2021-01-03T02:00:00Z | a213b | 15.08433 | 36.9978 |

{{% /expand %}}
{{< /expand-wrapper >}}
