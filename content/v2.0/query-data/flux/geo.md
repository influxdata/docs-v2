---
title: Work with geo-temporal data
description: >
  Use the Flux Geo package to filter geo-temporal data and group by geographic location or track.
menu:
  v2_0:
    name: Geo-temporal data
    parent: Query with Flux
weight: 220
---

Use the [Flux Geo package](/v2.0/reference/flux/stdlib/experimental/geo) to
filter geo-temporal data and group by geographic location or track.
Import the `experimental/geo` package.

```js
import "experimental/geo"
```

{{% warn %}}
The Geo package is experimental and subject to change at any time.
By using it, you agree to the [risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

### Primary Geo functions
The following functions provide the core functionality of the Geo package.
Other functions in the package exists primarily to support these functions:

- [`geo.s2CellIDToken()`](/v2.0/reference/flux/stdlib/experimental/geo/s2cellidtoken/)
- [`geo.filterRows()`](/v2.0/reference/flux/stdlib/experimental/geo/filterrows/)
- [`geo.asTracks()`](/v2.0/reference/flux/stdlib/experimental/geo/astracks/)
- [`geo.groupByArea()`](/v2.0/reference/flux/stdlib/experimental/geo/groupbyarea/)

### Shape your data for Geo functions
The Geo package requires the following data schema:

- a **`lat` field** field containing the **latitude in decimal degrees** (WGS 84)
- a **`lon` field** field containing the **longitude in decimal degrees** (WGS 84)
- an **s2_cell_id** tag.
    - Telegraf s2_geo processor (ships with Telegraf 1.14)
    - Language-specific S2 Libraries
    - `geo.s2CellIDToken()` to add the cell ID at query time.

## Define a region
- box
- circle
- polygon

## Filter geo-temporal data by region
- `geo.filterRows()`
- Strict vs non-strict filtering

## Group geo-temporal data

### Group data by area
- `geo.groupByArea()`

### Group data into tracks or routes
- `geo.groupByTrack()`

### Helper functions
```js
import "geo"

shapeGeoData = (tables=<-, latField, lonField, level, correlationKey=["_time"]),
  tables
    |> map(fn: (r) => ({ r with _field: if r._field == latFeild then "lat" else if r._field == lonField then "lon" else r._field }))
    |> geo.toRows(correlationKey: correlationKey)
    |> map(fn: (r) => ({ r with s2_cell_id: geo.s2CellIDToken( point: {lat: r.lat, lon: r.lon}, level: level)}))

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> shapeGeoData(latField: "latitude", lonField: "longitude", level: 10)
```
