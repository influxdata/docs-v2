---
title: hex.uint() function
description: >
  `hex.uint()` converts a hexadecimal string to an unsigned integer.
menu:
  flux_0_x_ref:
    name: hex.uint
    parent: contrib/bonitoo-io/hex
    identifier: contrib/bonitoo-io/hex/uint
weight: 301

---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/hex/hex.flux#L149-L149

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hex.uint()` converts a hexadecimal string to an unsigned integer.



##### Function type signature

```js
hex.uint = (v: string) => uint
```

## Parameters

### v

({{< req >}})
String to convert.


## Examples


### Convert a hexadecimal string to an unsigned integer

```js
import "contrib/bonitoo-io/hex"

hex.uint(v: "4d2")// Returns 1234

```

