---
title: geo.ST_DWithin() function
description: >
  The `geo.ST_DWithin()` function tests if the specified region is within a defined
  distance from the specified geographic information system (GIS) geometry and
  returns `true` or `false`.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/st_dwithin/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/st_dwithin/
menu:
  flux_0_x_ref:
    name: geo.ST_DWithin
    parent: geo
weight: 401
flux/v0.x/tags: [geotemporal, geo, GIS, tests]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.ST_DWithin()` function tests if the specified region is within a defined
distance from the specified geographic information system (GIS) geometry and
returns `true` or `false`.

```js
import "experimental/geo"

geo.ST_DWithin(
    region: {lat: 40.7, lon: -73.3, radius: 20.0},
    geometry: {lon: 39.7515, lat: 15.08433},
    distance: 1000.0,
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

### distance {data-type="float"}
Maximum distance allowed between the region and geometry.
_Define distance units with the [`geo.units` option](/flux/v0.x/stdlib/experimental/geo/#define-distance-units)._

## Examples

##### Test if geographic points are within a distance from a region
```js
import "experimental/geo"

region = {minLat: 40.51757813, maxLat: 40.86914063, minLon: -73.65234375, maxLon: -72.94921875}

data
    |> geo.toRows()
    |> map(
        fn: (r) =>
            ({r with st_within: geo.ST_DWithin(region: box, geometry: {lat: r.lat, lon: r.lon}, distance: 15.0)}),
    )
```
