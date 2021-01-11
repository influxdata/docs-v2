---
title: v1.fieldsAsCols() function
description: The v1.fieldsAsCols() function pivots a table to automatically align fields within each input table that have the same timestamp.
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs/fromrows
  - /influxdb/v2.0/reference/flux/functions/transformations/influxfieldsascols
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/fieldsascols/
  - /influxdb/v2.0/reference/flux/functions/influxdb-schema/fieldsascols/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/fieldsascols/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/fieldsascols/
menu:
  influxdb_2_0_ref:
    name: v1.fieldsAsCols
    parent: InfluxDB v1
weight: 301
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.fieldsAsCols()` was deprecated in **Flux v0.88.0** in favor of
[`schema.fieldsAsCols()`](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/fieldsascols/).
{{% /warn %}}

The `v1.fieldsAsCols()` function is a special application of the
[`pivot()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot/)
function that pivots on `_field` and `_time` columns to aligns fields within each
input table that have the same timestamp. and resemble InfluxDB 1.x query output.

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
package v1

fieldsAsCols = (tables=<-) =>
  tables
    |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```

_**Used functions:**
[pivot()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot)_
