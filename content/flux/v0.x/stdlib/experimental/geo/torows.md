---
title: geo.toRows() function
description: >
  The geo.toRows() function pivots data into row-wise sets base on time.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/torows/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/torows/
menu:
  flux_0_x_ref:
    name: geo.toRows
    parent: geo
weight: 401
flux/v0.x/tags: [transformations, geotemporal, geo]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
  - /flux/v0.x/stdlib/universe/pivot/
introduced: 0.63.1
---

The `geo.toRows()` function pivots data into row-wise sets base on time.
For geo-temporal datasets, output rows include `lat` and `lon` columns required by
many Geo package functions.

```js
import "experimental/geo"

geo.toRows()
```

## Examples
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
```

## Function definition
```js
toRows = (tables=<-) =>
  tables
    |> v1.fieldsAsCols()
```
