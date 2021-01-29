---
title: findColumn() function
description: >
  The `findColumn()` function returns an array of values in a specified column from the
  first table in a stream of tables where group key values match the specified predicate.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/findcolumn/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/findcolumn/
menu:
  flux_0_x_ref:
    name: findColumn
    parent: universe
weight: 102
flux/v0.x/tags: [dynamic queries]
related:
  - /influxdb/v2.0/query-data/flux/scalar-values/
introduced: 0.68.0
---

The `findColumn()` function returns an array of values in a specified column from the
first table in a stream of tables where the group key values match the specified predicate.
The function returns an empty array if no table is found or if the column label
is not present in the set of columns.

_**Function type:** Stream and table_  

```js
findColumn(
  fn: (key) => key._field == "fieldName",
  column: "_value"
)
```

## Parameters

### fn
A predicate function for matching keys in a table's group key.
Expects a `key` argument that represents a group key in the input stream.

_**Data type:** Function_

### column
Name of the column to extract.

_**Data type:** String_

## Example
```js
vs = from(bucket:"example-bucket")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> findColumn(
      fn: (key) => key._field == "usage_idle",
      column: "_value"
    )

// Use column values
x = vs[0] + vs[1]
```
