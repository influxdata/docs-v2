---
title: geo.asTracks() function
description: >
  The geo.asTracks() function groups rows into tracks (sequential, related data points).
menu:
  influxdb_2_0_ref:
    name: geo.asTracks
    parent: Geo
weight: 401
influxdb/v2.0/tags: [functions, geo]
related:
  - /influxdb/v2.0/query-data/flux/geo/
---

The `geo.asTracks()` function groups rows into tracks (sequential, related data points).

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.asTracks(
  groupBy: ["id","tid"],
  orderBy: ["_time"]
)
```

## Parameters

### groupBy
Columns to group by.
These columns should uniquely identify each track.
Default is `["id","tid"]`.

_**Data type:** Array of strings_

### orderBy
Column to order results by.
Default is `["_time"]`

_**Data type:** Array of strings_

## Examples

##### Group tracks in a box-shaped region
```js
import "experimental/geo"

region = {
  minLat: 40.51757813,
  maxLat: 40.86914063,
  minLon: -73.65234375,
  maxLon: -72.94921875
}

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.gridFilter(region: region)
  |> geo.toRows(correlationKey: ["_time", "id"])
  |> geo.asTracks()
```

## Function definition
```js
asTracks = (tables=<-, groupBy=["id","tid"], orderBy=["_time"]) =>
  tables
    |> group(columns: groupBy)
    |> sort(columns: orderBy)
```
