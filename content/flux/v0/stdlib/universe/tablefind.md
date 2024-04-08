---
title: tableFind() function
description: >
  `tableFind()` extracts the first table in a stream with group key values that
  match a specified predicate.
menu:
  flux_v0_ref:
    name: tableFind
    parent: universe
    identifier: universe/tableFind
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2953-L2956

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tableFind()` extracts the first table in a stream with group key values that
match a specified predicate.



##### Function type signature

```js
(<-tables: stream[B], fn: (key: A) => bool) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### fn
({{< req >}})
Predicate function to evaluate input table group keys.

`tableFind()` returns the first table that resolves as `true`.
The predicate function requires a `key` argument that represents each input
table's group key as a record.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Extract a table from a stream of tables

```js
import "sampledata"

t =
    sampledata.int()
        |> tableFind(
            fn: (key) => key.tag == "t2",
        )// t represents the first table in a stream whose group key
// contains "tag" with a value of "t2".


```

