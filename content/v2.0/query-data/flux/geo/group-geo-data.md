---
title: Group geo-temporal data
description: >
  Use the `geo.groupByArea()` and `geo.groupByTrack()` functions to group geo-temporal
  data points by area or by tracks or routes.
menu:
  v2_0:
    parent: Geo-temporal data
weight: 302
---

Use the `geo.groupByArea()` and `geo.asTracks()` functions to group geo-temporal
data points by area or by tracks or routes.

- [Group data by area](#group-data-by-area)
- [Group data into tracks or routes](#group-data-into-tracks-or-routes)

### Group data by area
Use the [`geo.groupByArea()` function](/v2.0/reference/flux/stdlib/experimental/geo/groupbyarea/)
to group geo-temporal data points by geographic area.
Areas are determined by [S2 grid cells](https://s2geometry.io/devguide/s2cell_hierarchy.html#s2cellid-numbering)

- Use the `newColumn` parameter to specify a new column in which to store the unique area identifier for each point.
- Use the `level` parameter to specify the [S2 cell level](https://s2geometry.io/resources/s2cell_statistics)
  to use when calculating geographic areas.

The following example uses the [sample bird migration data](/v2.0/query-data/flux/geo/#sample-data)
to query data points within 200km of Cairo, Egypt and group them by geographic area:

```js
import "experimental/geo"

sampleGeoData
  |> geo.filterRows(region: {lat: 30.04, lon: 31.23, radius: 200.0})
  |> geo.groupByArea(
    newColumn: "geoArea",
    level: 5
  )
```

### Group data into tracks or routes
Use [`geo.asTracks()` function](/v2.0/reference/flux/stdlib/experimental/geo/astracks/)
to group data points into tracks or routes and order them by time or other columns.
Data must contain a unique identifier for each track. For example: `id` or `tid`.

- Use the `groupBy` parameter to specify columns that uniquely identify each track or route.
- Use the `sortBy` parameter to specify which columns to sort by. Default is `["_time"]`.

The following example uses the [sample bird migration data](/v2.0/query-data/flux/geo/#sample-data)
to query data points within 200km of Cairo, Egypt and group them into routes unique
to each bird:

```js
import "experimental/geo"

sampleGeoData
  |> geo.filterRows(region: {lat: 30.04, lon: 31.23, radius: 200.0})
  |> geo.asTracks(
    groupBy: ["id"],
    sortBy: ["_time"]
  )
```
