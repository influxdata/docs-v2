---
title: geo.gridFilter() function
description: >
  `geo.gridFilter()` filters data by a specified geographic region.
menu:
  flux_v0_ref:
    name: geo.gridFilter
    parent: experimental/geo
    identifier: experimental/geo/gridFilter
weight: 201
flux/v0/tags: [transformations, filters, geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L677-L715

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.gridFilter()` filters data by a specified geographic region.

The function compares input data to a set of S2 cell ID tokens located in the specified region.
Input data must include an `s2_cell_id` column that is **part of the group key**.

**Note**: S2 Grid cells may not perfectly align with the defined region,
so results may include data with coordinates outside the region, but inside
S2 grid cells partially covered by the region.
Use `geo.toRows()` and `geo.strictFilter()` after `geo.gridFilter()` to precisely filter points.

##### Function type signature

```js
(
    <-tables: stream[{B with s2_cell_id: string}],
    region: A,
    ?level: int,
    ?maxSize: int,
    ?minSize: int,
    ?s2cellIDLevel: int,
    ?units: {distance: string},
) => stream[{B with s2_cell_id: string}] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

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
used in the `s2_cell_id` tag. Default is `-1` (detects S2 cell level from the S2 cell ID token).



### units

Record that defines the unit of measurement for distance.
Default is the `geo.units` option.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Filter data to a specified region

```js
import "experimental/geo"

data
    |> geo.gridFilter(region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0})

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | lat      | lon      | *s2_cell_id |
| -------------------- | ----- | -------- | -------- | ----------- |
| 2021-01-03T02:00:00Z | a213b | 39.08433 | -75.9978 | 89b875      |

| _time                | *id   | lat      | lon      | *s2_cell_id |
| -------------------- | ----- | -------- | -------- | ----------- |
| 2021-01-01T00:00:00Z | a213b | 41.01433 | -70.7515 | 89e55d      |

| _time                | *id   | lat     | lon      | *s2_cell_id |
| -------------------- | ----- | ------- | -------- | ----------- |
| 2021-01-02T01:00:00Z | a213b | 40.9228 | -73.3527 | 89e825      |


#### Output data

| _time                | *id   | lat     | lon      | *s2_cell_id |
| -------------------- | ----- | ------- | -------- | ----------- |
| 2021-01-02T01:00:00Z | a213b | 40.9228 | -73.3527 | 89e825      |

{{% /expand %}}
{{< /expand-wrapper >}}
