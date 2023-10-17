---
title: findRecord() function
description: >
  `findRecord()` returns a row at a specified index as a record from the first
  table in a stream of tables that matches the specified predicate function.
menu:
  flux_v0_ref:
    name: findRecord
    parent: universe
    identifier: universe/findRecord
weight: 101
flux/v0.x/tags: [dynamic queries]
introduced: 0.68.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3094-L3097

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`findRecord()` returns a row at a specified index as a record from the first
table in a stream of tables that matches the specified predicate function.

The function returns an empty record if no table is found or if the index is
out of bounds.

##### Function type signature

```js
(<-tables: stream[B], fn: (key: A) => bool, idx: int) => B where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### idx
({{< req >}})
Index of the record to extract.



### fn
({{< req >}})
Predicate function to evaluate input table group keys.

`findColumn()` uses the first table that resolves as `true`.
The predicate function requires a `key` argument that represents each input
table's group key as a record.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Extract a row as a record

```js
import "sampledata"

sampledata.int()
    |> findRecord(
        fn: (key) => key.tag == "t1",
        idx: 0,
    )// Returns {_time: 2021-01-01T00:00:00.000000000Z, _value: -2, tag: t1}


```

