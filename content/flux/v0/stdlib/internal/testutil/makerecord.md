---
title: testutil.makeRecord() function
description: >
  `testutil.makeRecord()` is the identity function, but breaks the type connection from input to output.
menu:
  flux_v0_ref:
    name: testutil.makeRecord
    parent: internal/testutil
    identifier: internal/testutil/makeRecord
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/testutil/testutil.flux#L21-L21

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testutil.makeRecord()` is the identity function, but breaks the type connection from input to output.



##### Function type signature

```js
(o: A) => B where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### o
({{< req >}})
Record value.



