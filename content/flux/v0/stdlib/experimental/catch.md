---
title: experimental.catch() function
description: >
  `experimental.catch()` calls a function and returns any error as a string value.
  If the function does not error the returned value is made into a string and returned.
menu:
  flux_v0_ref:
    name: experimental.catch
    parent: experimental
    identifier: experimental/catch
weight: 101

introduced: 0.174.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1375-L1375

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.catch()` calls a function and returns any error as a string value.
If the function does not error the returned value is made into a string and returned.



##### Function type signature

```js
(fn: () => A) => {value: A, msg: string, code: uint}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### fn
({{< req >}})
Function to call.




## Examples

### Catch an explicit error

```js
import "experimental"

experimental.catch(fn: () => die(msg: "error message"))// Returns "error message"


```

