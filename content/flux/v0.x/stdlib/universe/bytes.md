---
title: bytes() function
description: >
  `bytes()` converts a string value to a bytes type.
menu:
  flux_0_x_ref:
    name: bytes
    parent: universe
    identifier: universe/bytes
weight: 101
flux/v0.x/tags: [type-conversions]
introduced: 0.40.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3077-L3077

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bytes()` converts a string value to a bytes type.



##### Function type signature

```js
(v: A) => bytes
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert.




## Examples

### Convert a string to bytes

```js
bytes(v: "Example string")// Returns 0x4578616d706c6520737472696e67


```

