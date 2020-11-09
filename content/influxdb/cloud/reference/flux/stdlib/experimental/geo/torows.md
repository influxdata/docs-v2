---
title: geo.toRows() function
description: >
  The geo.toRows() function pivots data into row-wise sets base on time.
menu:
  influxdb_cloud_ref:
    name: geo.toRows
    parent: Geo
weight: 401
influxdb/v2.0/tags: [functions, geo]
related:
  - /influxdb/cloud/query-data/flux/geo/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/pivot/
---

The `geo.toRows()` function pivots data into row-wise sets base on time.
For geo-temporal datasets, output rows include `lat` and `lon` columns required by
many Geo package functions.

_**Function type:** Transformation_

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
toRows = (tables=<-, correlationKey=["_time"]) =>
  tables
    |> v1.fieldsAsCols()
```
