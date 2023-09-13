---
title: geo.stContains() function
description: >
  `geo.stContains()` returns boolean indicating whether the defined region contains a specified GIS geometry.
menu:
  flux_v0_ref:
    name: geo.stContains
    parent: experimental/geo
    identifier: experimental/geo/stContains
weight: 201
flux/v0.x/tags: [geotemporal]
introduced: 0.78.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L202-L205

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.stContains()` returns boolean indicating whether the defined region contains a specified GIS geometry.

`geo.stContains` is used as a helper function for `geo.ST_Contains()`.

##### Function type signature

```js
(geometry: A, region: B, units: {distance: string}) => bool where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### region
({{< req >}})
Region to test. Specify record properties for the shape.



### geometry
({{< req >}})
GIS geometry to test. Can be either point or linestring geometry.



### units
({{< req >}})
Record that defines the unit of measurement for distance.



