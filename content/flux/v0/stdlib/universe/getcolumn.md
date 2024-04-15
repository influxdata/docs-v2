---
title: getColumn() function
description: >
  `getColumn()` extracts a specified column from a table as an array.
menu:
  flux_v0_ref:
    name: getColumn
    parent: universe
    identifier: universe/getColumn
weight: 101
flux/v0/tags: [dynamic queries]
introduced: 0.29.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2996-L2996

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`getColumn()` extracts a specified column from a table as an array.

If the specified column is not present in the table, the function returns an error.

##### Function type signature

```js
(<-table: stream[A], column: string) => [B] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### column
({{< req >}})
Column to extract.



### table

Input table. Default is piped-forward data (`<-`).




## Examples

- [Extract an array of column values from a table](#extract-an-array-of-column-values-from-a-table)
- [Extract an array of column values and display them in a table](#extract-an-array-of-column-values-and-display-them-in-a-table)

### Extract an array of column values from a table

```js
import "sampledata"

sampledata.int()
    |> tableFind(fn: (key) => key.tag == "t1")
    |> getColumn(column: "_value")// Returns [-2, 10, 7, 17, 15, 4]


```


### Extract an array of column values and display them in a table

```js
import "array"
import "sampledata"

columnData =
    sampledata.int()
        |> tableFind(fn: (key) => key.tag == "t1")
        |> getColumn(column: "_value")

array.from(rows: [{_value: display(v: columnData)}])

```

