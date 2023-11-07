---
title: geo.ST_Length() function
description: >
  `geo.ST_Length()` returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
  of the specified GIS geometry.
menu:
  flux_v0_ref:
    name: geo.ST_Length
    parent: experimental/geo
    identifier: experimental/geo/ST_Length
weight: 201
flux/v0/tags: [geotemporal]
introduced: 0.78.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L318-L318

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.ST_Length()` returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
of the specified GIS geometry.



##### Function type signature

```js
(geometry: A, ?units: {distance: string}) => float where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### geometry
({{< req >}})
GIS geometry to test. Can be either point or linestring geometry.
Point geometry will always return `0.0`.



### units

Record that defines the unit of measurement for distance.



