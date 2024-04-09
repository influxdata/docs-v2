---
title: testutil.makeAny() function
description: >
  `testutil.makeAny()` constructs any value based on a type description as a string.
menu:
  flux_v0_ref:
    name: testutil.makeAny
    parent: internal/testutil
    identifier: internal/testutil/makeAny
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/testutil/testutil.flux#L27-L27

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testutil.makeAny()` constructs any value based on a type description as a string.



##### Function type signature

```js
(typ: string) => A
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### typ
({{< req >}})
Description of the type to create.



