---
title: findRecord() function
description: >
  The `findRecord()` function returns a record at a specified index from the first
  table in a stream of tables where the group key values match the specified predicate.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/findrecord/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/findrecord/
menu:
  flux_0_x_ref:
    name: findRecord
    parent: universe
weight: 102
flux/v0.x/tags: [dynamic queries]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/scalar-values/
introduced: 0.68.0
---

The `findRecord()` function returns a record at a specified index from the first
table in a stream of tables where the group key values match the specified predicate.
The function returns an empty record if no table is found or if the index is out of bounds.

```js
findRecord(
  fn: (key) => key._field == "fieldName"),
  idx: 0
)
```

## Parameters

### fn {data-type="function"}
A predicate function for matching keys in a table's group key.
Expects a `key` argument that represents a group key in the input stream.

### idx {data-type="int"}
Index of the record to extract.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Example
```js
r0 = from(bucket:"example-bucket")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> tableFind()
    |> findRecord(
      fn: (key) => key._field == "usage_idle",
      idx: 0
    )

// Use record values
x = r0._field + "--" + r0._measurement
```
