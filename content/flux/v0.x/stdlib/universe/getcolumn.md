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
  - /{{< latest "influxdb" >}}/query-data/flux/scalar-values/
introduced: 0.29.0
---

The `getColumn()` function extracts a column from a table given its label.
If the label is not present in the set of columns, the function errors.

```js
getColumn(column: "_value")
```

{{% note %}}
#### Use tableFind() to extract a single table
`getColumn()` requires a single table as input.
Use [`tableFind()`](/flux/v0.x/stdlib/universe/tablefind/)
to extract a single table from a stream of tables.
{{% /note %}}

## Parameters

### column {data-type="string"}
Name of the column to extract.

### table {data-type="table"}
Input table.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Example
{{% flux/sample-example-intro %}}

```js
import "sampledata"

sampledata.int()
  |> tableFind(fn: (key) => key.tag == "t1")
  |> getColumn(column: "_value")

// Returns [-2, 10, 7, 17, 15, 4]
```
