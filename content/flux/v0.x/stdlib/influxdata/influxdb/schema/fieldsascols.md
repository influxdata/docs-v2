---
title: schema.fieldsAsCols() function
description: The schema.fieldsAsCols() function pivots a table to automatically align fields within each input table that have the same timestamp.
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs/fromrows
  - /influxdb/v2.0/reference/flux/functions/transformations/influxfieldsascols
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/fieldsascols/
  - /influxdb/v2.0/reference/flux/functions/influxdb-schema/fieldsascols/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/fieldsascols/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/fieldsascols/
menu:
  flux_0_x_ref:
    name: schema.fieldsAsCols
    parent: schema
weight: 301
flux/v0.x/tags: [transformations]
introduced: 0.88.0
---

The `schema.fieldsAsCols()` function is a special application of the
[`pivot()`](/flux/v0.x/stdlib/universe/pivot/)
function that pivots on `_field` and `_time` columns to aligns fields within each
input table that have the same timestamp.

```js
import "influxdata/influxdb/schema"

schema.fieldsAsCols()
```

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
[pivot()](/flux/v0.x/stdlib/universe/pivot)_
