---
title: debug.opaque() function
description: >
  `debug.opaque()` works like `pass` in that it passes any incoming tables directly to the
  following transformation, save for its type signature does not indicate that the
  input type has any correlation with the output type.
menu:
  flux_v0_ref:
    name: debug.opaque
    parent: internal/debug
    identifier: internal/debug/opaque
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L23-L23

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.opaque()` works like `pass` in that it passes any incoming tables directly to the
following transformation, save for its type signature does not indicate that the
input type has any correlation with the output type.



##### Function type signature

```js
(<-tables: stream[A]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Stream to pass unmodified to next transformation.



