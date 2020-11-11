---
title: geo.ST_Intersects() function
description: >
  The `geo.ST_Intersects()` function tests if the specified geographic information
  system (GIS) geometry intersects with the specified region and returns `true` or `false`.
menu:
  influxdb_cloud_ref:
    name: geo.ST_Intersects
    parent: Geo
weight: 401
influxdb/v2.0/tags: [functions, geo, GIS]
related:
  - /influxdb/cloud/query-data/flux/geo/
---

The `geo.ST_Intersects()` function tests if the specified geographic information
system (GIS) geometry intersects with the specified region and returns `true` or `false`.

_**Function type:** Test_

```js
import "experimental/geo"

geo.ST_Intersects(
  region: {lat: 40.7, lon: -73.3, radius: 20.0},
  geometry: {linestring: "39.7515 14.01433, 38.3527 13.9228, 36.9978 15.08433"}
)

// Returns false
```

## Parameters

### region
The region to test.
Specify record properties for the shape.
_See [Region definitions](/influxdb/cloud/reference/flux/stdlib/experimental/geo/#region-definitions)._

_**Data type:** Record_

### geometry
The GIS geometry to test.
Can be either point or linestring geometry.
_See [GIS geometry definitions](/influxdb/cloud/reference/flux/stdlib/experimental/geo/#gis-geometry-definitions)._

_**Data type:** Record_

## Examples

##### Test if geographic points intersect with a region
```js
import "experimental/geo"

region = {
  minLat: 40.51757813,
  maxLat: 40.86914063,
  minLon: -73.65234375,
  maxLon: -72.94921875
}

data
  |> geo.toRows()
  |> map(fn: (r) => ({
    r with st_within: geo.ST_Intersects(region: box, geometry: {lat: r.lat, lon: r.lon})
  }))
```
