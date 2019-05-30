---
title: v1.fieldsAsCols() function
description: The v1.fieldsAsCols() function is pivots a table and automatically aligns fields within each input table that have the same timestamp.
aliases:
  - /v2.0/reference/flux/functions/inputs/fromrows
  - /v2.0/reference/flux/functions/transformations/influxfieldsascols
menu:
  v2_0_ref:
    name: v1.fieldsAsCols
    parent: InfluxDB v1
weight: 301
---

The `v1.fieldsAsCols()` function is a special application of the `pivot()` function that
automatically aligns fields within each input table that have the same timestamp.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/v1"

v1.fieldsAsCols()
```

## Examples
```js
import "influxdata/influxdb/v1"

from(bucket:"example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> v1.fieldsAsCols()
  |> keep(columns: ["_time", "cpu", "usage_idle", "usage_user"])
```

## Function definition
```js
fieldsAsCols = (tables=<-) =>
  tables
    |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```

_**Used functions:**
[pivot()](/v2.0/reference/flux/functions/built-in/transformations/pivot)_
