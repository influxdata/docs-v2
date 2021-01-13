---
title: geo.ST_Contains() function
description: >
  The `geo.ST_Contains()` function tests if the specified region contains the specified
  GIS geometry and returns `true` or `false`.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/st_contains/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/st_contains/
menu:
  flux_0_x_ref:
    name: geo.ST_Contains
    parent: Geo
weight: 401
flux/v0.x/tags: [functions, geo, GIS]
related:
  - /influxdb/v2.0/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.ST_Contains()` function tests if the specified region contains the specified
geographic information system (GIS) geometry and returns `true` or `false`.

_**Function type:** Test_

```js
import "experimental/geo"

geo.ST_Contains(
  region: {lat: 40.7, lon: -73.3, radius: 20.0},
  geometry: {lon: 39.7515, lat: 15.08433}
)

// Returns false
```

## Parameters

### region
The region to test.
Specify record properties for the shape.
_See [Region definitions](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#region-definitions)._

_**Data type:** Record_

### geometry
The GIS geometry to test.
Can be either point or linestring geometry.
_See [GIS geometry definitions](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#gis-geometry-definitions)._

_**Data type:** Record_

## Examples

##### Test if geographic points are inside of a region
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
    r with st_contains: geo.ST_Contains(region: region, geometry: {lat: r.lat, lon: r.lon})
  }))
```

##### Test if tracks are inside of a region
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
  |> geo.asTracks()
  |> geo.ST_LineString()
  |> map(fn: (r) => ({
    r with st_contains: geo.ST_Contains(region: region, geometry: {linestring: r.st_linestring})
  }))
```
