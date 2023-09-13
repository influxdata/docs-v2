---
title: debug.pass() function
description: >
  `debug.pass()` will pass any incoming tables directly next to the following transformation.
  It is best used to interrupt any planner rules that rely on a specific ordering.
menu:
  flux_v0_ref:
    name: debug.pass
    parent: internal/debug
    identifier: internal/debug/pass
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L14-L14

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.pass()` will pass any incoming tables directly next to the following transformation.
It is best used to interrupt any planner rules that rely on a specific ordering.



##### Function type signature

```js
(<-tables: stream[A]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Stream to pass unmodified to next transformation.



