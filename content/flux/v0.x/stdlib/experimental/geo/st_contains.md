---
title: geo.ST_Contains() function
description: >
  `geo.ST_Contains()` returns boolean indicating whether the defined region contains a
  specified GIS geometry.
menu:
  flux_0_x_ref:
    name: geo.ST_Contains
    parent: experimental/geo
    identifier: experimental/geo/ST_Contains
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L248-L248

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.ST_Contains()` returns boolean indicating whether the defined region contains a
specified GIS geometry.



##### Function type signature

```js
geo.ST_Contains = (geometry: A, region: B, ?units: {distance: string}) => bool where A: Record, B: Record
```

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

