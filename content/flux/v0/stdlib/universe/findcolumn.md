---
title: findColumn() function
description: >
  `findColumn()` returns an array of values in a specified column from the first
  table in a stream of tables that matches the specified predicate function.
menu:
  flux_v0_ref:
    name: findColumn
    parent: universe
    identifier: universe/findColumn
weight: 101
flux/v0/tags: [dynamic queries]
introduced: 0.68.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3057-L3060

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`findColumn()` returns an array of values in a specified column from the first
table in a stream of tables that matches the specified predicate function.

The function returns an empty array if no table is found or if the column
label is not present in the set of columns.

##### Function type signature

```js
(<-tables: stream[B], column: string, fn: (key: A) => bool) => [C] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column
({{< req >}})
Column to extract.



### fn
({{< req >}})
Predicate function to evaluate input table group keys.

`findColumn()` uses the first table that resolves as `true`.
The predicate function requires a `key` argument that represents each input
table's group key as a record.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Extract a column as an array

```js
import "sampledata"

sampledata.int()
    |> findColumn(fn: (key) => key.tag == "t1", column: "_value")// Returns [-2, 10, 7, 17, 15, 4]


```

