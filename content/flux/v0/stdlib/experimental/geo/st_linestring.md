---
title: geo.ST_LineString() function
description: >
  `geo.ST_LineString()` converts a series of geographic points into linestring.
menu:
  flux_v0_ref:
    name: geo.ST_LineString
    parent: experimental/geo
    identifier: experimental/geo/ST_LineString
weight: 201
flux/v0/tags: [geotemporal, transformations, aggregates]
introduced: 0.78.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L356-L370

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.ST_LineString()` converts a series of geographic points into linestring.

Group data into meaningful, ordered paths to before converting to linestring.
Rows in each table must have `lat` and `lon` columns.
Output tables contain a single row with a `st_linestring` column containing
the resulting linestring.

##### Function type signature

```js
(<-tables: stream[{A with lon: C, lat: B}]) => stream[D] where D: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Convert a series of geographic points into linestring

```js
import "experimental/geo"

data
    |> geo.ST_LineString()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | lon     | lat      |
| -------------------- | ----- | ------- | -------- |
| 2021-01-01T00:00:00Z | a213b | 39.7515 | 14.01433 |
| 2021-01-02T01:00:00Z | a213b | 38.3527 | 13.9228  |
| 2021-01-03T02:00:00Z | a213b | 36.9978 | 15.08433 |

| _time                | *id   | lon     | lat      |
| -------------------- | ----- | ------- | -------- |
| 2021-01-01T00:00:00Z | b546c | 24.0069 | -14.5464 |
| 2021-01-02T01:00:00Z | b546c | 25.1304 | -13.3338 |
| 2021-01-03T02:00:00Z | b546c | 26.7899 | -12.0433 |


#### Output data

| *id   | st_linestring                                       |
| ----- | --------------------------------------------------- |
| a213b | 39.7515 14.01433, 38.3527 13.9228, 36.9978 15.08433 |

| *id   | st_linestring                                        |
| ----- | ---------------------------------------------------- |
| b546c | 24.0069 -14.5464, 25.1304 -13.3338, 26.7899 -12.0433 |

{{% /expand %}}
{{< /expand-wrapper >}}
