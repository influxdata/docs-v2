---
title: dynamic.isType() function
description: >
  `dynamic.isType()` tests if a dynamic type holds a value of a specified type.
menu:
  flux_v0_ref:
    name: dynamic.isType
    parent: experimental/dynamic
    identifier: experimental/dynamic/isType
weight: 201
flux/v0.x/tags: [types, tests]
introduced: 0.186.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/dynamic/dynamic.flux#L81-L81

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`dynamic.isType()` tests if a dynamic type holds a value of a specified type.



##### Function type signature

```js
(type: string, v: dynamic) => bool
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to test.



### type
({{< req >}})
String describing the type to check against.

**Supported types**:
- string
- bytes
- int
- uint
- float
- bool
- time
- duration
- regexp
- array
- object
- function
- dictionary
- vector

