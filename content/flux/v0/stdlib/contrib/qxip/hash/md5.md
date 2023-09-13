---
title: hash.md5() function
description: >
  `hash.md5()` converts a string value to an MD5 hash.
menu:
  flux_v0_ref:
    name: hash.md5
    parent: contrib/qxip/hash
    identifier: contrib/qxip/hash/md5
weight: 301

introduced: 0.193.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/hash/hash.flux#L131-L131

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hash.md5()` converts a string value to an MD5 hash.



##### Function type signature

```js
(v: A) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String to hash.




## Examples

### Convert a string to an MD5 hash

```js
import "contrib/qxip/hash"

hash.md5(v: "Hello, world!")// Returns 2359500134450972198


```

