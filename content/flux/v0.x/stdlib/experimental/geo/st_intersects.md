---
title: geo.ST_Intersects() function
description: >
  The `geo.ST_Intersects()` function tests if the specified geographic information
  system (GIS) geometry intersects with the specified region and returns `true` or `false`.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/st_intersects/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/st_intersects/
menu:
  flux_0_x_ref:
    name: geo.ST_Intersects
    parent: geo
weight: 401
flux/v0.x/tags: [geotemporal, geo, GIS, tests]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
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

### region {data-type="record"}
The region to test.
Specify record properties for the shape.
_See [Region definitions](/flux/v0.x/stdlib/experimental/geo/#region-definitions)._

### geometry {data-type="record"}
The GIS geometry to test.
Can be either point or linestring geometry.
_See [GIS geometry definitions](/flux/v0.x/stdlib/experimental/geo/#gis-geometry-definitions)._

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
