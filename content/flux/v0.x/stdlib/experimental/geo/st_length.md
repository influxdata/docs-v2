---
title: geo.ST_Length() function
description: >
  The `geo.ST_Length()` function returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
  of the specified geographic information system (GIS) geometry.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/st_length/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/st_length/
menu:
  flux_0_x_ref:
    name: geo.ST_Length
    parent: geo
weight: 401
flux/v0.x/tags: [geotemporal, geo, GIS]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.ST_Length()` function returns the [spherical length or distance](https://mathworld.wolfram.com/SphericalDistance.html)
of the specified geographic information system (GIS) geometry.
Define distance units with the [`geo.units` option](/flux/v0.x/stdlib/experimental/geo/#define-distance-units).

```js
import "experimental/geo"

geo.ST_Length(
    geometry: {linestring: "39.7515 14.01433, 38.3527 13.9228, 36.9978 15.08433"},
)

// Returns 346.1023974652474 (km)
```

## Parameters

### geometry {data-type="record"}
The GIS geometry to measure.
Can be either point or linestring geometry.
Points will always return `0.0`.
_See [GIS geometry definitions](/flux/v0.x/stdlib/experimental/geo/#gis-geometry-definitions)._

## Examples

##### Calculate the length of geographic paths
```js
import "experimental/geo"

region = {minLat: 40.51757813, maxLat: 40.86914063, minLon: -73.65234375, maxLon: -72.94921875}

data
    |> geo.toRows()
    |> geo.asTracks()
    |> geo.ST_LineString()
    |> map(fn: (r) => ({r with st_length: geo.ST_Length(geometry: {linestring: r.st_linestring})}))
```
