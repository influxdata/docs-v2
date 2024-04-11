---
title: geo.ST_Distance() function
description: >
  `geo.ST_Distance()` returns the distance from a given region to a specified GIS geometry.
menu:
  flux_v0_ref:
    name: geo.ST_Distance
    parent: experimental/geo
    identifier: experimental/geo/ST_Distance
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L269-L270

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.ST_Distance()` returns the distance from a given region to a specified GIS geometry.



##### Function type signature

```js
(geometry: A, region: B, ?units: {distance: string}) => float where A: Record, B: Record
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



### units

Record that defines the unit of measurement for distance.
Default is the `geo.units` option.



