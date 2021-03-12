---
title: schema.fieldsAsCols() function
description: The schema.fieldsAsCols() function pivots a table to automatically align fields within each input table that have the same timestamp.
aliases:
  - /influxdb/cloud/reference/flux/functions/inputs/fromrows
  - /influxdb/cloud/reference/flux/functions/transformations/influxfieldsascols
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/fieldsascols/
  - /influxdb/cloud/reference/flux/functions/influxdb-schema/fieldsascols/
menu:
  influxdb_cloud_ref:
    name: schema.fieldsAsCols
    parent: InfluxDB Schema
weight: 301
introduced: 0.88.0
---

The `schema.fieldsAsCols()` function is a special application of the
[`pivot()`](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/pivot/)
function that pivots on `_field` and `_time` columns to aligns fields within each
input table that have the same timestamp.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/schema"

schema.fieldsAsCols()
```

## Examples
```js
import "influxdata/influxdb/schema"

from(bucket:"example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> schema.fieldsAsCols()
  |> keep(columns: ["_time", "cpu", "usage_idle", "usage_user"])
```

## Function definition
```js
package schema

fieldsAsCols = (tables=<-) =>
  tables
    |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```

_**Used functions:**
[pivot()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/pivot)_
