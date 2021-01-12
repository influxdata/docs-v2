---
title: getRecord() function
description: >
  The `getRecord()` function extracts a record from a table given its index.
  If the index is out of bounds, the function errors.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/stream-table/getrecord/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/getrecord/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/getrecord/
menu:
  flux_0_x_ref:
    name: getRecord
    parent: Stream & table
weight: 501
related:
  - /influxdb/v2.0/query-data/flux/scalar-values/
introduced: 0.29.0
---

The `getRecord()` function extracts a record from a table given the record's index.
If the index is out of bounds, the function errors.

_**Function type:** Stream and table_  

```js
getRecord(idx: 0)
```

{{% note %}}
#### Use tableFind() to extract a single table
`getRecord()` requires a single table as input.
Use [`tableFind()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/)
to extract a single table from a stream of tables.
{{% /note %}}

## Parameters

### idx
Index of the record to extract.

_**Data type:** Integer_

## Example
```js
r0 = from(bucket:"example-bucket")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> tableFind(fn: (key) => key._field == "usage_idle")
    |> getRecord(idx: 0)

// Use record values
x = r0._field + "--" + r0._measurement
```
