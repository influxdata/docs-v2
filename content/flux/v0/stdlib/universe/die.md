---
title: die() function
description: >
  `die()` stops the Flux script execution and returns an error message.
menu:
  flux_v0_ref:
    name: die
    parent: universe
    identifier: universe/die
weight: 101

introduced: 0.82.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L303-L303

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`die()` stops the Flux script execution and returns an error message.



##### Function type signature

```js
(msg: string) => A
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### msg
({{< req >}})
Error message to return.




## Examples

### Force a script to exit with an error message

```js
die(msg: "This is an error message")

```

