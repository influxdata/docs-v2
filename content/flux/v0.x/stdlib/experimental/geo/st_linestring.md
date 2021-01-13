---
title: geo.ST_LineString() function
description: >
  The `geo.ST_LineString()` function converts a series of geographic points into
  [linestring](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#linestring).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/st_linestring/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/st_linestring/
menu:
  flux_0_x_ref:
    name: geo.ST_LineString
    parent: Geo
weight: 401
flux/v0.x/tags: [functions, geo, GIS]
related:
  - /influxdb/v2.0/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.ST_LineString()` function converts a series of geographic points into
[linestring](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#linestring).
Group data into meaningful, ordered paths to before converting to linestring.
Rows in each table must have `lat` and `lon` columns.
Output tables contain a single row with a `st_linestring` column containing the resulting linestring.

_**Function type:** Aggregate_

```js
import "experimental/geo"

geo.ST_LineString()
```

## Examples

### Convert a series of geographic points into linestring

##### Input data

| _time                | id    | lon     | lat      |
|:-----                |:--:   | ---:    | ---:     |
| 2020-01-01T00:00:00Z | a213b | 39.7515 | 14.01433 |
| 2020-01-02T00:00:00Z | a213b | 38.3527 | 13.9228  |
| 2020-01-03T00:00:00Z | a213b | 36.9978 | 15.08433 |


```js
import "experimental/geo"

data
  |> geo.ST_LineString()
```

##### Output data

| id    | st_linestring                                       |
|:--    |:introduced: 0.63.0
-------------                                       |
| a213b | 39.7515 14.01433, 38.3527 13.9228, 36.9978 15.08433 |

## Function definition
```js
ST_LineString = (tables=<-) =>
  tables
    |> reduce(fn: (r, accumulator) => ({
        __linestring: accumulator.__linestring + (if accumulator.__count > 0 then ", " else "") + string(v: r.lat) + " " + string(v: r.lon),
        __count: accumulator.__count + 1
      }), identity: {
        __linestring: "",
        __count: 0
      }
    )
    |> rename(columns: {__linestring: "st_linestring"})
```
