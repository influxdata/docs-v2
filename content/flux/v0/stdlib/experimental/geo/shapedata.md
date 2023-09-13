---
title: geo.shapeData() function
description: >
  `geo.shapeData()` renames existing latitude and longitude fields to **lat** and **lon**
  and adds an **s2\_cell\_id** tag.
menu:
  flux_v0_ref:
    name: geo.shapeData
    parent: experimental/geo
    identifier: experimental/geo/shapeData
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L599-L617

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.shapeData()` renames existing latitude and longitude fields to **lat** and **lon**
and adds an **s2\_cell\_id** tag.

Use `geo.shapeData()` to ensure geotemporal data meets the requirements of the Geo package:

1. Rename existing latitude and longitude fields to `lat` and `lon`.
2. Pivot fields into columns based on `_time`.
3. Generate `s2_cell_id` tags using `lat` and `lon` values and a specified [S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html).

##### Function type signature

```js
(
    <-tables: stream[{C with _field: string}],
    latField: A,
    level: int,
    lonField: B,
) => stream[{D with s2_cell_id: string, lon: float, lat: float}] where A: Equatable, B: Equatable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### latField
({{< req >}})
Name of the existing field that contains the latitude value in decimal degrees (WGS 84).

Field is renamed to `lat`.

### lonField
({{< req >}})
Name of the existing field that contains the longitude value in decimal degrees (WGS 84).

Field is renamed to `lon`.

### level
({{< req >}})
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html)
to use when generating the S2 cell ID token.



### tables

Input data. Default is piped-forward data (`<-`).



