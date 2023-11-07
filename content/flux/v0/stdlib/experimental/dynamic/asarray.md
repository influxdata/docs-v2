---
title: dynamic.asArray() function
description: >
  `dynamic.asArray()` converts a dynamic value into an array of dynamic elements.
menu:
  flux_v0_ref:
    name: dynamic.asArray
    parent: experimental/dynamic
    identifier: experimental/dynamic/asArray
weight: 201
flux/v0/tags: [type-conversions]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/dynamic/dynamic.flux#L27-L27

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dynamic.asArray()` converts a dynamic value into an array of dynamic elements.

The dynamic input value must be an array. If it is not an array, `dynamic.asArray()` returns an error.

##### Function type signature

```js
(<-v: dynamic) => [dynamic]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v

Dynamic value to convert. Default is the piped-forward value (`<-`).



