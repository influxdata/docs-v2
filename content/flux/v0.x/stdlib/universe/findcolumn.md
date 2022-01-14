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
  - /{{< latest "influxdb" >}}/query-data/flux/scalar-values/
introduced: 0.68.0
---

The `findColumn()` function returns an array of values in a specified column from the
first table in a stream of tables where the group key values match the specified predicate.
The function returns an empty array if no table is found or if the column label
is not present in the set of columns.

```js
findColumn(
  fn: (key) => key._field == "fieldName",
  column: "_value"
)
```

## Parameters

### fn {data-type="function"}
A predicate function for matching keys in a table's group key.
Expects a `key` argument that represents a group key in the input stream.

### column {data-type="string"}
Name of the column to extract.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Example
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> findColumn(
    fn: (key) => key.tag == "t1",
    column: "_value"
  )

// Returns [-2, 10, 7, 17, 15, 4]
```
