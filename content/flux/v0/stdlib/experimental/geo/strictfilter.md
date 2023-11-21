---
title: geo.strictFilter() function
description: >
  `geo.strictFilter()` filters data by latitude and longitude in a specified region.
menu:
  flux_v0_ref:
    name: geo.strictFilter
    parent: experimental/geo
    identifier: experimental/geo/strictFilter
weight: 201
flux/v0/tags: [transformations, filters, geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L756-L758

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.strictFilter()` filters data by latitude and longitude in a specified region.

This filter is more strict than `geo.gridFilter()`, but for the best performance,
use `geo.strictFilter()` after `geo.gridFilter()`.
Input rows must have `lat` and `lon` columns.

##### Function type signature

```js
(<-tables: stream[{B with lon: D, lat: C}], region: A) => stream[{B with lon: D, lat: C}] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### region
({{< req >}})
Region containing the desired data points.

Specify record properties for the shape.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Strictly filter data to a specified region

```js
import "experimental/geo"

data
    |> geo.strictFilter(region: {lat: 40.69335938, lon: -73.30078125, radius: 50.0})

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | lat      | lon      | *s2_cell_id |
| -------------------- | ----- | -------- | -------- | ----------- |
| 2021-01-03T02:00:00Z | a213b | 39.08433 | -75.9978 | 89bc        |

| _time                | *id   | lat      | lon      | *s2_cell_id |
| -------------------- | ----- | -------- | -------- | ----------- |
| 2021-01-01T00:00:00Z | a213b | 41.01433 | -70.7515 | 89e4        |

| _time                | *id   | lat     | lon      | *s2_cell_id |
| -------------------- | ----- | ------- | -------- | ----------- |
| 2021-01-02T01:00:00Z | a213b | 40.9228 | -73.3527 | 89ec        |


#### Output data

| _time                | *id   | lat     | lon      | *s2_cell_id |
| -------------------- | ----- | ------- | -------- | ----------- |
| 2021-01-02T01:00:00Z | a213b | 40.9228 | -73.3527 | 89ec        |

{{% /expand %}}
{{< /expand-wrapper >}}
