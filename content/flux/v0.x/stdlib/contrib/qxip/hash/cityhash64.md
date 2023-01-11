---
title: hash.cityhash64() function
description: >
  `hash.cityhash64()` converts a string value to a 64-bit hexadecimal hash using the CityHash64 algorithm.
menu:
  flux_0_x_ref:
    name: hash.cityhash64
    parent: contrib/qxip/hash
    identifier: contrib/qxip/hash/cityhash64
weight: 301

---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/hash/hash.flux#L68-L68

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hash.cityhash64()` converts a string value to a 64-bit hexadecimal hash using the CityHash64 algorithm.



##### Function type signature

```js
(v: A) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String to hash.




## Examples

### Convert a string to a 64-bit hash using CityHash64

```js
import "contrib/qxip/hash"

hash.cityhash64(v: "Hello, world!")// Returns 2359500134450972198


```

