---
title: array.from() function
description: >
  The experimental `array.from()` function constructs a table from an array of records.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/array/from/
  - /influxdb/cloud/reference/flux/stdlib/array/from/
  - /influxdb/v2.0/reference/flux/stdlib/experimental/array/from/
  - /influxdb/cloud/reference/flux/stdlib/experimental/array/from/
menu:
  flux_0_x_ref:
    name: array.from
    parent: array
weight: 401
flux/v0.x/tags: [inputs]
introduced: 0.103.0
---

The `array.from()` function constructs a table from an array of records.
Each record in the array is converted into an output row or record.
All records must have the same keys and data types.

{{< keep-url >}}
```js
import "array"

array.from(rows: [
  {_time: 2020-01-01T00:00:00Z, _field: "exampleField", _value: 3, foo: "bar"},
  {_time: 2020-01-01T00:01:00Z, _field: "exampleField", _value: 4, foo: "bar"},
  {_time: 2020-01-01T00:02:00Z, _field: "exampleField", _value: 1, foo: "bar"}
])
```

## Parameters

### rows {data-type="array"}
Array of records to construct a table with.

## Examples

##### Build an arbitrary table
```js
import "array"

rows = [
  {foo: "bar", baz: 21.2},
  {foo: "bar", baz: 23.8}
]

array.from(rows: rows)
```

##### Union custom rows with query results
```js
import "influxdata/influxdb/v1"
import "array"

tags = v1.tagValues(
  bucket: "example-bucket",
  tag: "host"
)

wildcard_tag = array.from(rows: [{_value: "*"}])

union(tables: [tags, wildcard_tag])
```
