---
title: hash.hmac() function
description: >
  `hash.hmac()` converts a string value to an MD5-signed SHA-1 hash.
menu:
  flux_v0_ref:
    name: hash.hmac
    parent: contrib/qxip/hash
    identifier: contrib/qxip/hash/hmac
weight: 301

introduced: 0.193.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/hash/hash.flux#L153-L153

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hash.hmac()` converts a string value to an MD5-signed SHA-1 hash.



##### Function type signature

```js
(k: A, v: A) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String to hash.



### k
({{< req >}})
Key to sign hash.




## Examples

### Convert a string and key to a base64-signed hash

```js
import "contrib/qxip/hash"

hash.hmac(v: "helloworld", k: "123456")// Returns 75B5ueLnnGepYvh+KoevTzXCrjc=


```

