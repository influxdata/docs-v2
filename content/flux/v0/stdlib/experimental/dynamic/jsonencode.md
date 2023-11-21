---
title: dynamic.jsonEncode() function
description: >
  `dynamic.jsonEncode()` converts a dynamic value into JSON bytes.
menu:
  flux_v0_ref:
    name: dynamic.jsonEncode
    parent: experimental/dynamic
    identifier: experimental/dynamic/jsonEncode
weight: 201
flux/v0/tags: [type-conversions]
introduced: 0.186.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/dynamic/dynamic.flux#L54-L54

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dynamic.jsonEncode()` converts a dynamic value into JSON bytes.



##### Function type signature

```js
(v: dynamic) => bytes
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to encode into JSON.



