---
title: getColumn() function
description: >
  The `getColumn()` function extracts a column from a table given its label.
  If the label is not present in the set of columns, the function errors.
aliases:
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/stream-table/getcolumn/
menu:
  influxdb_cloud_ref:
    name: getColumn
    parent: Stream & table
weight: 501
related:
  - /influxdb/cloud/query-data/flux/scalar-values/
---

The `getColumn()` function extracts a column from a table given its label.
If the label is not present in the set of columns, the function errors.

_**Function type:** Stream and table_  

```js
getColumn(column: "_value")
```

{{% note %}}
#### Use tableFind() to extract a single table
`getColumn()` requires a single table as input.
Use [`tableFind()`](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/)
to extract a single table from a stream of tables.
{{% /note %}}

## Parameters

### column
Name of the column to extract.

_**Data type:** String_

## Example
```js
vs = from(bucket:"example-bucket")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> tableFind(fn: (key) => key._field == "usage_idle")
    |> getColumn(column: "_value")

// Use column values
x = vs[0] + vs[1]
```
