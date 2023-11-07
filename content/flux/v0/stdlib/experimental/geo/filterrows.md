---
title: geo.filterRows() function
description: >
  `geo.filterRows()` filters data by a specified geographic region with the option of strict filtering.
menu:
  flux_v0_ref:
    name: geo.filterRows
    parent: experimental/geo
    identifier: experimental/geo/filterRows
weight: 201
flux/v0/tags: [transformations, filters, geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L839-L881

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.filterRows()` filters data by a specified geographic region with the option of strict filtering.

This function is a combination of `geo.gridFilter()` and `geo.strictFilter()`.
Input data must include an `s2_cell_id` column that is **part of the group key**.

##### Function type signature

```js
(
    <-tables: stream[{B with s2_cell_id: string, lon: D, lat: C}],
    region: A,
    ?level: int,
    ?maxSize: int,
    ?minSize: int,
    ?s2cellIDLevel: int,
    ?strict: bool,
) => stream[{B with s2_cell_id: string, lon: D, lat: C}] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### region
({{< req >}})
Region containing the desired data points.

Specify record properties for the shape.

### minSize

Minimum number of cells that cover the specified region.
Default is `24`.



### maxSize

Maximum number of cells that cover the specified region.
Default is `-1` (unlimited).



### level

[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html)
of grid cells. Default is `-1`.

**Note:** `level` is mutually exclusive with `minSize` and `maxSize` and
must be less than or equal to `s2cellIDLevel`.

### s2cellIDLevel

[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html)
used in the `s2_cell_id` tag. Default is `-1` (detects S2 cell level from the `s2_cell_id` tag).



### strict

Enable strict geographic data filtering. Default is `true`.

Strict filtering returns only points with coordinates in the defined region.
Non-strict filtering returns all points from S2 grid cells that are partially
covered by the defined region.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Strictly filter geotemporal data by region](#strictly-filter-geotemporal-data-by-region)
- [Approximately filter geotemporal data by region](#approximately-filter-geotemporal-data-by-region)

### Strictly filter geotemporal data by region

```js
import "experimental/geo"

data
    |> geo.filterRows(region: {lat: 40.69335938, lon: -73.30078125, radius: 100.0})

```


### Approximately filter geotemporal data by region

```js
import "experimental/geo"

data
    |> geo.filterRows(region: {lat: 40.69335938, lon: -73.30078125, radius: 100.0}, strict: false)

```

