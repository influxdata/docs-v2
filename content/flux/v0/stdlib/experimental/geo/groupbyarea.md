---
title: geo.groupByArea() function
description: >
  `geo.groupByArea()` groups rows by geographic area.
menu:
  flux_v0_ref:
    name: geo.groupByArea
    parent: experimental/geo
    identifier: experimental/geo/groupByArea
weight: 201
flux/v0/tags: [transformations, geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L924-L948

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.groupByArea()` groups rows by geographic area.

Area sizes are determined by the specified `level`.
Each geographic area is assigned a unique identifier (the S2 cell ID token)
which is stored in the `newColumn`.
Results are grouped by `newColumn`.

##### Function type signature

```js
(
    <-tables: stream[{A with s2_cell_id: string, lon: float, lat: float}],
    level: int,
    newColumn: string,
    ?s2cellIDLevel: int,
) => stream[B] where B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### newColumn
({{< req >}})
Name of the new column for the unique identifier for each geographic area.



### level
({{< req >}})
[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html)
used to determine the size of each geographic area.



### s2cellIDLevel

[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html)
used in the `s2_cell_id` tag. Default is `-1` (detects S2 cell level from the `s2_cell_id` tag).



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Group geotemporal data by geographic area

```js
import "experimental/geo"

data
    |> geo.groupByArea(newColumn: "foo", level: 4)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | lat      | lon      | *s2_cell_id |
| -------------------- | ----- | -------- | -------- | ----------- |
| 2021-01-03T02:00:00Z | a213b | 39.08433 | -75.9978 | 89bc        |

| _time                | *id   | lat      | lon      | *s2_cell_id |
| -------------------- | ----- | -------- | -------- | ----------- |
| 2021-01-01T00:00:00Z | a213b | 41.01433 | -70.7515 | 89e4        |

| _time                | *id   | lat     | lon      | *s2_cell_id |
| -------------------- | ----- | ------- | -------- | ----------- |
| 2021-01-02T01:00:00Z | a213b | 40.9228 | -73.3527 | 89ec        |


#### Output data

| *foo | _time                | id    | lat      | lon      | s2_cell_id  |
| ---- | -------------------- | ----- | -------- | -------- | ----------- |
| 89b  | 2021-01-03T02:00:00Z | a213b | 39.08433 | -75.9978 | 89bc        |

| *foo | _time                | id    | lat      | lon      | s2_cell_id  |
| ---- | -------------------- | ----- | -------- | -------- | ----------- |
| 89f  | 2021-01-01T00:00:00Z | a213b | 41.01433 | -70.7515 | 89e4        |
| 89f  | 2021-01-02T01:00:00Z | a213b | 40.9228  | -73.3527 | 89ec        |

{{% /expand %}}
{{< /expand-wrapper >}}
