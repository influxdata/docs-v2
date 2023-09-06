---
title: hex.int() function
description: >
  `hex.int()` converts a hexadecimal string to an integer.
menu:
  flux_v0_ref:
    name: hex.int
    parent: contrib/bonitoo-io/hex
    identifier: contrib/bonitoo-io/hex/int
weight: 301

---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/hex/hex.flux#L29-L29

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hex.int()` converts a hexadecimal string to an integer.



##### Function type signature

```js
(v: string) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String to convert.




## Examples

### Convert hexadecimal string to integer

```js
import "contrib/bonitoo-io/hex"

hex.int(v: "4d2")// Returns 1234


```

