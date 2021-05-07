---
title: geo.ST_Length() function
description: >
  The `geo.ST_Length()` function returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
  of the specified geographic information system (GIS) geometry.
menu:
  influxdb_cloud_ref:
    name: geo.ST_Length
    parent: Geo
weight: 401
influxdb/v2.0/tags: [functions, geo, GIS]
related:
  - /influxdb/cloud/query-data/flux/geo/
---

The `geo.ST_Length()` function returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
of the specified geographic information system (GIS) geometry.
Define distance units with the [`geo.units` option](/influxdb/cloud/reference/flux/stdlib/experimental/geo/#define-distance-units).

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.ST_Length(
  geometry: {linestring: "39.7515 14.01433, 38.3527 13.9228, 36.9978 15.08433"}
)

// Returns 346.1023974652474 (km)
```

## Parameters

### geometry
The GIS geometry to measure.
Can be either point or linestring geometry.
Points will always return `0.0`.
_See [GIS geometry definitions](/influxdb/cloud/reference/flux/stdlib/experimental/geo/#gis-geometry-definitions)._

_**Data type:** Record_

## Examples

##### Calculate the length of geographic paths
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
    r with st_length: geo.ST_Length(geometry: {linestring: r.st_linestring})
  }))
```
