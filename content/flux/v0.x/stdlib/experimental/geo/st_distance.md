---
title: geo.ST_Distance() function
description: >
  The `geo.ST_Distance()` function returns the distance between the specified region
  and specified GIS geometry.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/st_distance/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/st_distance/
menu:
  flux_0_x_ref:
    name: geo.ST_Distance
    parent: geo
weight: 401
flux/v0.x/tags: [geotemporal, geo, GIS]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.ST_Distance()` function returns the distance between the specified region
and specified geographic information system (GIS) geometry.
Define distance units with the [`geo.units` option](/flux/v0.x/stdlib/experimental/geo/#define-distance-units).

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.ST_Distance(
  region: {lat: 40.7, lon: -73.3, radius: 20.0},
  geometry: {lon: 39.7515, lat: 15.08433}
)

// Returns 10734.184618677662 (km)
```

## Parameters

### region
The region to test.
Specify record properties for the shape.
_See [Region definitions](/flux/v0.x/stdlib/experimental/geo/#region-definitions)._

_**Data type:** Record_

### geometry
The GIS geometry to test.
Can be either point or linestring geometry.
_See [GIS geometry definitions](/flux/v0.x/stdlib/experimental/geo/#gis-geometry-definitions)._

_**Data type:** Record_

## Examples

##### Calculate the distance between geographic points and a region
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
    r with st_distance: ST_Distance(region: region, geometry: {lat: r.lat, lon: r.lon})
  }))
```

##### Find the point nearest to a geographic location
```js
import "experimental/geo"

fixedLocation = {lat: 40.7, lon: -73.3}

data
  |> geo.toRows()
  |> map(fn: (r) => ({ r with
    _value: geo.ST_Distance(region: {lat: r.lat, lon: r.lon}, geometry: fixedLocation)
  }))
  |> min()
```
