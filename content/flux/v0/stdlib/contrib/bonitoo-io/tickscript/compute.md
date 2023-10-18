---
title: tickscript.compute() function
description: >
  `tickscript.compute()` is an alias for `tickscript.select()` that changes a column’s name and
  optionally applies an aggregate or selector function.
menu:
  flux_v0_ref:
    name: tickscript.compute
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/compute
weight: 301
flux/v0.x/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L393-L393

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.compute()` is an alias for `tickscript.select()` that changes a column’s name and
optionally applies an aggregate or selector function.



##### Function type signature

```js
(<-tables: B, as: string, ?column: A, ?fn: (<-: B, column: A) => stream[C]) => stream[D] where A: Equatable, C: Record, D: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### as
({{< req >}})
New column name.



### column

Column to operate on. Default is `_value`.



### fn

Aggregate or selector function to apply.



### tables

Input data. Default is piped-forward data (`<-`).



