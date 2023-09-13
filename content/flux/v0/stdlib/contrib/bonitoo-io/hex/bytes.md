---
title: hex.bytes() function
description: >
  `hex.bytes()` converts a hexadecimal string to bytes.
menu:
  flux_v0_ref:
    name: hex.bytes
    parent: contrib/bonitoo-io/hex
    identifier: contrib/bonitoo-io/hex/bytes
weight: 301

---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/hex/hex.flux#L171-L171

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hex.bytes()` converts a hexadecimal string to bytes.



##### Function type signature

```js
(v: string) => bytes
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String to convert.




## Examples

### Convert a hexadecimal string into bytes

```js
import "contrib/bonitoo-io/hex"

hex.bytes(v: "FF5733")// Returns [255 87 51] (bytes)


```

