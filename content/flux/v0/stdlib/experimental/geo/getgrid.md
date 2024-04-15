---
title: geo.getGrid() function
description: >
  `geo.getGrid()` calculates a grid or set of cell ID tokens for a specified region.
menu:
  flux_v0_ref:
    name: geo.getGrid
    parent: experimental/geo
    identifier: experimental/geo/getGrid
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L386-L395

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.getGrid()` calculates a grid or set of cell ID tokens for a specified region.

**Note**: S2 grid cells may not perfectly align with the defined region,
so results include S2 grid cells fully and partially covered by the region.

##### Function type signature

```js
(
    region: A,
    units: {distance: string},
    ?level: int,
    ?maxLevel: int,
    ?maxSize: int,
    ?minSize: int,
) => {set: [string], level: int} where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### region
({{< req >}})
Region used to return S2 cell ID tokens.
Specify record properties for the region shape.



### minSize

Minimum number of cells that cover the specified region.



### maxSize

Minimum number of cells that cover the specified region.



### level

S2 cell level of grid cells.



### maxLevel

Maximumn S2 cell level of grid cells.



### units
({{< req >}})
Record that defines the unit of measurement for distance.



