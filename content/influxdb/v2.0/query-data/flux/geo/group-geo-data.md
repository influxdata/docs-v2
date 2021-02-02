---
title: Group geo-temporal data
description: >
  Use the `geo.groupByArea()` to group geo-temporal data by area and `geo.asTracks()`
  to group data into tracks or routes.
menu:
  influxdb_2_0:
    parent: Geo-temporal data
weight: 302
related:
  - /{{< latest "flux" >}}/stdlib/experimental/geo/
  - /{{< latest "flux" >}}/stdlib/experimental/geo/groupbyarea/
  - /{{< latest "flux" >}}/stdlib/experimental/geo/astracks/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.groupByArea(newColumn: "geoArea", level: 5)
    |> geo.asTracks(groupBy: ["id"],sortBy: ["_time"])
  ```
---

Use the `geo.groupByArea()` to group geo-temporal data by area and `geo.asTracks()`
to group data into tracks or routes.

- [Group data by area](#group-data-by-area)
- [Group data into tracks or routes](#group-data-by-track-or-route)

{{% note %}}
For example results, use the [bird migration sample data](/influxdb/v2.0/reference/sample-data/#bird-migration-sample-data)
to populate the `sampleGeoData` variable in the queries below.
{{% /note %}}

### Group data by area
Use the [`geo.groupByArea()` function](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/groupbyarea/)
to group geo-temporal data points by geographic area.
Areas are determined by [S2 grid cells](https://s2geometry.io/devguide/s2cell_hierarchy.html#s2cellid-numbering)

- Specify a new column to store the unique area identifier for each point with the `newColumn` parameter.
- Specify the [S2 cell level](https://s2geometry.io/resources/s2cell_statistics)
  to use when calculating geographic areas with the `level` parameter.

The following example uses the [sample bird migration data](/influxdb/v2.0/query-data/flux/geo/#sample-data)
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

### Group data by track or route
Use [`geo.asTracks()` function](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/astracks/)
to group data points into tracks or routes and order them by time or other columns.
Data must contain a unique identifier for each track. For example: `id` or `tid`.

- Specify columns that uniquely identify each track or route with the `groupBy` parameter.
- Specify which columns to sort by with the `sortBy` parameter. Default is `["_time"]`.

The following example uses the [sample bird migration data](/influxdb/v2.0/query-data/flux/geo/#sample-data)
to query data points within 200km of Cairo, Egypt and group them into routes unique
to each bird:

```js
import "experimental/geo"

sampleGeoData
  |> geo.filterRows(region: {lat: 30.04, lon: 31.23, radius: 200.0})
  |> geo.asTracks(
    groupBy: ["id"],
    orderBy: ["_time"]
  )
```
