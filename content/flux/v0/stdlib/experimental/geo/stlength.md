---
title: geo.stLength() function
description: >
  `geo.stLength()` returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
  of the specified GIS geometry.
menu:
  flux_v0_ref:
    name: geo.stLength
    parent: experimental/geo
    identifier: experimental/geo/stLength
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L239-L239

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.stLength()` returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
of the specified GIS geometry.

`geo.stLength` is used as a helper function for `geo.ST_Length()`.

##### Function type signature

```js
(geometry: A, units: {distance: string}) => float where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### geometry
({{< req >}})
GIS geometry to test. Can be either point or linestring geometry.
Point geometry will always return `0.0`.



### units
({{< req >}})
Record that defines the unit of measurement for distance.



