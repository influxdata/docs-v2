---
title: Flux stream and table functions
list_title: Stream and table functions
seotitle: Flux built-in stream and table functions
description: >
  Use stream and table functions to extract a table from a stream of tables and access its
  columns and records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/stream-table/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/
weight: 401
menu:
  flux_0_x_ref:
    name: Stream & table
    parent: built-in-transformations
flux/v0.x/tags: [transformations, built-in, functions, stream, table]
related:
  - /influxdb/v2.0/query-data/flux/scalar-values/
---

Use stream and table functions to extract a table from a stream of tables and access its
columns and records.

{{< children type="functions" >}}

### Example stream and table functions

##### Recommended usage
```js
data = from(bucket:"example-bucket")
  |> range(start: -5m)
  |> filter(fn:(r) => r._measurement == "cpu")

// Extract the "_value" column from the table
data
  |> findColumn(fn: (key) => key._field == "usage_idle", column: "_value")

// Extract the first record from the table
data
  |> findRecord(fn: (key) => key._field == "usage_idle", idx: 0)

```

##### Alternate usage
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
