---
title: geo.s2CellLatLon() function
description: >
  The `geo.s2CellLatLon()` function returns the latitude and longitude of the
  center of an S2 cell.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/s2celllatlon/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/s2celllatlon/
menu:
  influxdb_2_0_ref:
    name: geo.s2CellLatLon
    parent: Geo
weight: 401
influxdb/v2.0/tags: [functions, geo]
related:
  - /influxdb/v2.0/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.s2CellLatLon()` function returns the latitude and longitude of the
center of an S2 cell.

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.s2CellLatLon(
  token: "89c284"
)

// Returns {lat: 40.812535546624574, lon: -73.55941282728273}
```

## Parameters

### token
S2 cell ID token.

_**Data type:** String_
