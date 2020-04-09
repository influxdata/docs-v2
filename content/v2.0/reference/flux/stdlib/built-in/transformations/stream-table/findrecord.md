---
title: findRecord() function
description: >
  The `findRecord()` function returns a record at a specified index from the first
  table in a stream of tables where the group key values match the specified predicate.
menu:
  v2_0_ref:
    name: findRecord
    parent: Stream & table
weight: 501
---

The `findRecord()` function returns a record at a specified index from the first
table in a stream of tables where the group key values match the specified predicate.
The function returns an empty object if no table is found or if the index is out of bounds.

_**Function type:** Stream and table_  

```js
findRecord(
  fn: (key) => key._field == "fieldName",
  idx: 0
)
```

## Parameters

### fn
A predicate function for matching keys in a table's group key.
It expects a `key` argument which represents a group key in the input stream.

_**Data type:** Function_

### idx
The index of the record to extract.

_**Data type:** Integer_

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
