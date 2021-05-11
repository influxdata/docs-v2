---
title: geo.s2CellIDToken() function
description: >
  The `geo.s2CellIDToken()` function returns an S2 cell ID token.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/s2cellidtoken/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/s2cellidtoken/
menu:
  flux_0_x_ref:
    name: geo.s2CellIDToken
    parent: geo
weight: 401
flux/v0.x/tags: [geotemporal, geo]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.s2CellIDToken()` function returns an S2 cell ID token.

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.s2CellIDToken(
  point: {lat: 37.7858229, lon: -122.4058124},
  level: 10
)
```

## Parameters

### point {data-type="record"}
Longitude and latitude in **decimal degrees** (WGS 84) to use when generating
the S2 cell ID token.
Record must contain `lat` and `lon` properties.

### token {data-type="string"}
S2 cell ID token to update.
Useful for changing the S2 cell level of an existing S2 cell ID token.

{{% note %}}
`point` and `token` are mutually exclusive.
{{% /note %}}

### level {data-type="int"}
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html) to use
when generating the S2 cell ID token.

## Examples

##### Use latitude and longitude values to generate S2 cell ID tokens
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> map(fn: (r) => ({
    r with
    s2_cell_id: geo.s2CellIDToken(
      point: {lat: r.lat, lon: r.lon},
      level: 10
    )})
  )
```

##### Update S2 cell ID token level
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> map(fn: (r) => ({
    r with
    s2_cell_id: geo.s2CellIDToken(
      token: r.s2_cell_id,
      level: 10
    )})
  )
```
