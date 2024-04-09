---
title: hash.sha1() function
description: >
  `hash.sha1()` converts a string value to a hexadecimal hash using the SHA-1 hash algorithm.
menu:
  flux_v0_ref:
    name: hash.sha1
    parent: contrib/qxip/hash
    identifier: contrib/qxip/hash/sha1
weight: 301

introduced: 0.193.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/hash/hash.flux#L49-L49

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hash.sha1()` converts a string value to a hexadecimal hash using the SHA-1 hash algorithm.



##### Function type signature

```js
(v: A) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String to hash.




## Examples

### Convert a string to a SHA-1 hash

```js
import "contrib/qxip/hash"

hash.sha1(
    v: "Hello, world!",
)// Returns 315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3


```

