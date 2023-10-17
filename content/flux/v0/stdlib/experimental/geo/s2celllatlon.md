---
title: geo.s2CellLatLon() function
description: >
  `geo.s2CellLatLon()` returns the latitude and longitude of the center of an S2 cell.
menu:
  flux_v0_ref:
    name: geo.s2CellLatLon
    parent: experimental/geo
    identifier: experimental/geo/s2CellLatLon
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L498-L498

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.s2CellLatLon()` returns the latitude and longitude of the center of an S2 cell.



##### Function type signature

```js
(token: string) => {lon: float, lat: float}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### token
({{< req >}})
S2 cell ID token.




## Examples

### Return the center coordinates of an S2 cell

```js
import "experimental/geo"

geo.s2CellLatLon(token: "89c284")// Returns {lat: 40.812535546624574, lon: -73.55941282728273}


```

