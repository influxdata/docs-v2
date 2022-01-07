---
title: geo.s2CellLatLon() function
description: >
  The `geo.s2CellLatLon()` function returns the latitude and longitude of the
  center of an S2 cell.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/s2celllatlon/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/s2celllatlon/
menu:
  flux_0_x_ref:
    name: geo.s2CellLatLon
    parent: geo
weight: 401
flux/v0.x/tags: [geotemporal, geo]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.s2CellLatLon()` function returns the latitude and longitude of the
center of an S2 cell.

```js
import "experimental/geo"

geo.s2CellLatLon(
  token: "89c284"
)

// Returns {lat: 40.812535546624574, lon: -73.55941282728273}
```

## Parameters

### token {data-type="string"}
S2 cell ID token.
