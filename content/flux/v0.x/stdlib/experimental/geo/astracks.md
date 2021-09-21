---
title: geo.asTracks() function
description: >
  The geo.asTracks() function groups rows into tracks (sequential, related data points).
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/astracks/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/astracks/
menu:
  flux_0_x_ref:
    name: geo.asTracks
    parent: geo
weight: 401
flux/v0.x/tags: [transformations, geotemporal, geo]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.asTracks()` function groups rows into tracks (sequential, related data points).

```js
import "experimental/geo"

geo.asTracks(
  groupBy: ["id","tid"],
  orderBy: ["_time"]
)
```

## Parameters

### groupBy {data-type="array of strings"}
Columns to group by.
These columns should uniquely identify each track.
Default is `["id","tid"]`.

### orderBy {data-type="array of strings"}
Column to order results by.
Default is `["_time"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
