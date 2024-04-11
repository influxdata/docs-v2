---
title: geo.ST_DWithin() function
description: >
  `geo.ST_DWithin()` tests if the specified region is within a defined distance from
  the specified GIS geometry and returns `true` or `false`.
menu:
  flux_v0_ref:
    name: geo.ST_DWithin
    parent: experimental/geo
    identifier: experimental/geo/ST_DWithin
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L287-L288

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.ST_DWithin()` tests if the specified region is within a defined distance from
the specified GIS geometry and returns `true` or `false`.



##### Function type signature

```js
(distance: A, geometry: B, region: C, ?units: {distance: string}) => bool where A: Comparable + Equatable, B: Record, C: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### region
({{< req >}})
Region to test. Specify record properties for the shape.



### geometry
({{< req >}})
GIS geometry to test. Can be either point or linestring geometry.



### distance
({{< req >}})
Maximum distance allowed between the region and geometry.
Define distance units with the `geo.units` option.



### units

Record that defines the unit of measurement for distance.
Default is the `geo.units` option.



