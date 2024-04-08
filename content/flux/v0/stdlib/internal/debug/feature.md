---
title: debug.feature() function
description: >
  `debug.feature()` returns the value associated with the given feature flag.
menu:
  flux_v0_ref:
    name: debug.feature
    parent: internal/debug
    identifier: internal/debug/feature
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/debug/debug.flux#L54-L54

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`debug.feature()` returns the value associated with the given feature flag.



##### Function type signature

```js
(key: string) => A
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### key
({{< req >}})
Feature flag name.



