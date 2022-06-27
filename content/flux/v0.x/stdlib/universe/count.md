---
title: count() function
description: >
  `count()` returns the number of records in a column.
menu:
  flux_0_x_ref:
    name: count
    parent: universe
    identifier: universe/count
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L148-L148

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`count()` returns the number of records in a column.

The function counts both null and non-null records.

#### Empty tables
`count()` returns `0` for empty tables.
To keep empty tables in your data, set the following parameters for the
following functions:

| Function            | Parameter           |
| :------------------ | :------------------ |
| `filter()`          | `onEmpty: "keep"`   |
| `window()`          | `createEmpty: true` |
| `aggregateWindow()` | `createEmpty: true` |

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Column to count values in and store the total count.



### tables

Input data. Default is piped-wforward data (`<-`).




## Examples

### Count the number of rows in each input table

```js
import "sampledata"

sampledata.string()
    |> count()
```

