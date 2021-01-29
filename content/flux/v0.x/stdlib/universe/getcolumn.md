---
title: getColumn() function
description: >
  The `getColumn()` function extracts a column from a table given its label.
  If the label is not present in the set of columns, the function errors.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/stream-table/getcolumn/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/getcolumn/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/getcolumn/
menu:
  flux_0_x_ref:
    name: getColumn
    parent: universe
weight: 102
flux/v0.x/tags: [dynamic queries]
related:
  - /influxdb/v2.0/query-data/flux/scalar-values/
introduced: 0.29.0
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
Use [`tableFind()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/)
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
