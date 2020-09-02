---
title: geo.s2CellIDToken() function
description: >
  The `geo.s2CellIDToken()` function returns an S2 cell ID token.
menu:
  influxdb_2_0_ref:
    name: geo.s2CellIDToken
    parent: Geo
weight: 401
influxdb/v2.0/tags: [functions, geo]
related:
  - /influxdb/v2.0/query-data/flux/geo/
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

### point
Longitude and latitude in **decimal degrees** (WGS 84) to use when generating
the S2 cell ID token.
Record must contain `lat` and `lon` properties.

_**Data type:** Record_

### token
S2 cell ID token to update.
Useful for changing the S2 cell level of an existing S2 cell ID token.

_**Data type:** String_

{{% note %}}
`point` and `token` are mutually exclusive.
{{% /note %}}

### level
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html) to use
when generating the S2 cell ID token.

_**Data type:** Integer_

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
