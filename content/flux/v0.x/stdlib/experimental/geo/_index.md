---
title: Flux geo package
list_title: geo package
description: >
  The Flux `geo` package provides tools for working with geo-temporal data,
  such as filtering and grouping by geographic location.
  Import the `experimental/geo` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/
menu:
  flux_0_x_ref:
    name: geo
    parent: experimental
weight: 301
flux/v0.x/tags: [functions, package, geo]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The Flux `geo` package provides tools for working with geo-temporal data,
such as filtering and grouping by geographic location.
Import the `experimental/geo` package:

```js
import "experimental/geo"
```

## Options
```js
import "experimental/geo"

option geo.units = {distance: "km"}
```

### units {data-type="record"}
Units of distances used in geotemporal operations.
Default is `km`.

**Supported units:**

- `km` (kilometers)
- `mile` (miles)

## Functions
{{< children type="functions" show="pages" >}}

## Geo schema requirements
The Geo package uses the Go implementation of the [S2 Geometry Library](https://s2geometry.io/).
Functions in the Geo package require the following:

- a **`s2_cell_id` tag** containing an **S2 cell ID as a token** (more information [below](#s2-cell-ids))
- a **`lat` field** containing the **latitude in decimal degrees** (WGS 84)
- a **`lon` field** containing the **longitude in decimal degrees** (WGS 84)

#### Schema recommendations
- a tag that identifies the data source
- a tag that identifies the point type (for example: `start`, `stop`, `via`)
- a field that identifies the track or route (for example: `id`, `tid`)

##### Examples of geo-temporal line protocol
```
taxi,pt=start,s2_cell_id=89c2594 tip=3.75,dist=14.3,lat=40.744614,lon=-73.979424,tid=1572566401123234345i 1572566401947779410
bike,id=biker-007,pt=via,s2_cell_id=89c25dc lat=40.753944,lon=-73.992035,tid=1572588100i 1572567115
```

## S2 Cell IDs
Use **latitude** and **longitude** with the `s2.CellID.ToToken` endpoint of the S2
Geometry Library to generate `s2_cell_id` tags.
Specify your [S2 Cell ID level](https://s2geometry.io/resources/s2cell_statistics.html).

{{% note %}}
To filter more quickly, use higher S2 Cell ID levels,
but know that that higher levels increase [series cardinality](/{{< latest "influxdb" >}}/reference/glossary/#series-cardinality).
{{% /note %}}

Language-specific implementations of the S2 Geometry Library provide methods for
generating S2 Cell ID tokens. For example:

- **Go:** [`s2.CellID.ToToken()`](https://godoc.org/github.com/golang/geo/s2#CellID.ToToken)
- **Python:** [`s2sphere.CellId.to_token()`](https://s2sphere.readthedocs.io/en/latest/api.html#s2sphere.CellId)
- **Javascript:** [`s2.cellid.toToken()`](https://github.com/mapbox/node-s2/blob/master/API.md#cellidtotoken---string)

### Add S2 Cell IDs to existing geo-temporal data
Use the [`geo.shapeData()` function](/flux/v0.x/stdlib/experimental/geo/shapedata/)
to add `s2_cell_id` tags to data that includes fields with latitude and longitude values.

```js
//...
  |> shapeData(
    latField: "latitude",
    lonField: "longitude",
    level: 10
  )
```

## Latitude and longitude values
Flux supports latitude and longitude values in **decimal degrees** (WGS 84).

| Coordinate | Minimum | Maximum |
|:---------- | -------:| -------:|
| Latitude   | -90.0   | 90.0    |
| Longitude  | -180.0  | 180.0   |

## Region definitions
Many functions in the Geo package filter data based on geographic region.
Define geographic regions using the following shapes:

- [box](#box)
- [circle](#circle)
- [point](#point)
- [polygon](#polygon)

### box
Define a box-shaped region by specifying a record containing the following properties:

- **minLat:** minimum latitude in decimal degrees (WGS 84) _(Float)_
- **maxLat:** maximum latitude in decimal degrees (WGS 84) _(Float)_
- **minLon:** minimum longitude in decimal degrees (WGS 84) _(Float)_
- **maxLon:** maximum longitude in decimal degrees (WGS 84) _(Float)_

##### Example box-shaped region
```js
{
  minLat: 40.51757813,
  maxLat: 40.86914063,
  minLon: -73.65234375,
  maxLon: -72.94921875
}
```

### circle
Define a circular region by specifying a record containing the following properties:

- **lat**: latitude of the circle center in decimal degrees (WGS 84) _(Float)_
- **lon**: longitude of the circle center in decimal degrees (WGS 84) _(Float)_
- **radius**:  radius of the circle in kilometers (km) _(Float)_

##### Example circular region
```js
{
  lat: 40.69335938,
  lon: -73.30078125,
  radius: 20.0
}
```

### point
Define a point region by specifying a record containing the following properties:

- **lat**: latitude in decimal degrees (WGS 84) _(Float)_
- **lon**: longitude in decimal degrees (WGS 84) _(Float)_

##### Example point region
```js
{
  lat: 40.671659,
  lon: -73.936631
}
```

### polygon
Define a custom polygon region using a record containing the following properties:

- **points**: points that define the custom polygon _(Array of records)_

    Define each point with a record containing the following properties:

      - **lat**: latitude in decimal degrees (WGS 84) _(Float)_
      - **lon**: longitude in decimal degrees (WGS 84) _(Float)_

##### Example polygonal region
```js
{
  points: [
    {lat: 40.671659, lon: -73.936631},
    {lat: 40.706543, lon: -73.749177},
    {lat: 40.791333, lon: -73.880327}
  ]
}
```

## GIS geometry definitions
Many functions in the Geo package manipulate data based on geographic information system (GIS) data.
Define GIS geometry using the following:

- Any [region type](#region-definitions) _(typically [point](#point))_
- [linestring](#linestring)

### linestring
Define a geographic linestring path using a record containing the following properties:

- **linestring**: string containing comma-separated longitude and latitude
  coordinate pairs (`lon lat,`):

```js
{
  linestring: "39.7515 14.01433, 38.3527 13.9228, 36.9978 15.08433"
}
```

## Distance units
The Geo package supports the following units of measurement for distance:

- `m` - meters
- `km` - kilometers _(default)_
- `mile` - miles

### Define distance units
Use the Geo package `units` option to define custom units of measurement:

```js
import "experimental/geo"

option geo.units = {distance: "mile"}
```
