---
title: geo.totalDistance() function
description: >
  `geo.totalDistance()` calculates the total distance covered by subsequent points
  in each input table.
menu:
  flux_v0_ref:
    name: geo.totalDistance
    parent: experimental/geo
    identifier: experimental/geo/totalDistance
weight: 201
flux/v0/tags: [transformations, geotemporal, aggregates]
introduced: 0.192.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L1081-L1106

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.totalDistance()` calculates the total distance covered by subsequent points
in each input table.

Each row must contain `lat` (latitude) and `lon` (longitude) columns that
represent the geographic coordinates of the point.
Row sort order determines the order in which distance between points is calculated.
Use the `geo.units` option to specify the unit of distance to return (default is km).

##### Function type signature

```js
(<-tables: stream[{B with lon: float, lat: float}], ?outputColumn: A) => stream[C] where C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### outputColumn

Total distance output column. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Return the total distance travelled per input table](#return-the-total-distance-travelled-per-input-table)
- [Return the total distance travelled in miles](#return-the-total-distance-travelled-in-miles)

### Return the total distance travelled per input table

```js
import "experimental/geo"

data
    |> geo.totalDistance()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *id  | _time                | lat  | lon  |
| ---- | -------------------- | ---- | ---- |
| ABC1 | 2022-01-01T00:00:00Z | 85.1 | 42.2 |
| ABC1 | 2022-01-01T01:00:00Z | 71.3 | 50.8 |
| ABC1 | 2022-01-01T02:00:00Z | 63.1 | 62.3 |
| ABC1 | 2022-01-01T03:00:00Z | 50.6 | 74.9 |

| *id  | _time                | lat   | lon   |
| ---- | -------------------- | ----- | ----- |
| DEF2 | 2022-01-01T00:00:00Z | -10.8 | -12.2 |
| DEF2 | 2022-01-01T01:00:00Z | -16.3 | -0.8  |
| DEF2 | 2022-01-01T02:00:00Z | -23.2 | 12.3  |
| DEF2 | 2022-01-01T03:00:00Z | -30.4 | 24.9  |


#### Output data

| *id  | _value            |
| ---- | ----------------- |
| ABC1 | 4157.144498077607 |

| *id  | _value            |
| ---- | ----------------- |
| DEF2 | 4428.129653320098 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return the total distance travelled in miles

```js
import "experimental/geo"

option geo.units = {distance: "mile"}

data
    |> geo.totalDistance()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *id  | _time                | lat  | lon  |
| ---- | -------------------- | ---- | ---- |
| ABC1 | 2022-01-01T00:00:00Z | 85.1 | 42.2 |
| ABC1 | 2022-01-01T01:00:00Z | 71.3 | 50.8 |
| ABC1 | 2022-01-01T02:00:00Z | 63.1 | 62.3 |
| ABC1 | 2022-01-01T03:00:00Z | 50.6 | 74.9 |

| *id  | _time                | lat   | lon   |
| ---- | -------------------- | ----- | ----- |
| DEF2 | 2022-01-01T00:00:00Z | -10.8 | -12.2 |
| DEF2 | 2022-01-01T01:00:00Z | -16.3 | -0.8  |
| DEF2 | 2022-01-01T02:00:00Z | -23.2 | 12.3  |
| DEF2 | 2022-01-01T03:00:00Z | -30.4 | 24.9  |


#### Output data

| *id  | _value            |
| ---- | ----------------- |
| ABC1 | 2583.129833073356 |

| *id  | _value             |
| ---- | ------------------ |
| DEF2 | 2751.5122020650015 |

{{% /expand %}}
{{< /expand-wrapper >}}
