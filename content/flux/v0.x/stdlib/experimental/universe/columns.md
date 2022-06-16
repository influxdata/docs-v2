---
title: columns() function
description: >
  `columns()` returns the column labels in each input table.
menu:
  flux_0_x_ref:
    name: columns
    parent: experimental/universe
    identifier: experimental/universe/columns
weight: 201
flux/v0.x/tags: [transformations]
introduced: v0.166.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/universe/universe.flux#L40-L40

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`columns()` returns the column labels in each input table.

**Note:** `universe.columns()` is an experimental function with a more precise type signature.

For each input table, `columns` outputs a table with the same group key
columns and a new column containing the column labels in the input table.
Each row in an output table contains the group key value and the label of one
 column of the input table.
Each output table has the same number of rows as the number of columns of the input table.

##### Function type signature

```js
columns = (<-tables: stream[B], ?column: A = "_value") => stream[{A: string}] where A: Label, B: Record
```

## Parameters

### column


Name of the output column to store column labels in.
Default is "_value".

### tables


Input data. Default is piped-forward data (`<-`).


## Examples


### List all columns per input table

```js
import "experimental/universe"
import "sampledata"

sampledata.string()
    |> universe.columns(column: "labels")
```

