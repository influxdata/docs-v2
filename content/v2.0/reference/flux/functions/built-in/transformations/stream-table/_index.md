---
title: Flux stream and table functions
list_title: Stream and table functions
seotitle: Flux built-in stream and table functions
description: >
  Use stream and table functions to extract a table from a stream of tables and access its
  columns and records.
weight: 401
menu:
  v2_0_ref:
    name: Stream & table
    parent: built-in-transformations
v2.0/tags: [transformations, built-in, functions, stream, table]
---

Use stream and table functions to extract a table from a stream of tables and access its
columns and records.

##### Example stream and table functions
```js
data = from(bucket:"example-bucket")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")

// Extract the first available table for which "_field" is equal to "usage_idle"
t = data |> tableFind(fn: (key) => key._field == "usage_idle")

// Extract the "_value" column from the table
values = t |> getColumn(column: "_value")

// Extract the first record from the table
r0 = t |> getRecord(idx: 0)
```

{{< children type="functions" >}}
