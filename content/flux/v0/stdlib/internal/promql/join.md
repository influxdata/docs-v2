---
title: promql.join() function
description: >
  `promql.join()` joins two streams of tables on the **group key and `_time` column**.
  See [`experimental.join`](/flux/v0/stdlib/experimental/join/).
menu:
  flux_v0_ref:
    name: promql.join
    parent: internal/promql
    identifier: internal/promql/join
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/promql/promql.flux#L274-L274

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`promql.join()` joins two streams of tables on the **group key and `_time` column**.
See [`experimental.join`](/flux/v0/stdlib/experimental/join/).

**Important**: The `internal/promql` package is not meant for external use.

##### Function type signature

```js
(fn: (left: A, right: B) => C, left: stream[A], right: stream[B]) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### left
({{< req >}})
First of two streams of tables to join.



### right
({{< req >}})
Second of two streams of tables to join.



### fn
({{< req >}})
Function with left and right arguments that maps a new output record
using values from the `left` and `right` input records.
The return value must be a record.



