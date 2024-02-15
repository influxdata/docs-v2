---
title: math.atan2() function
description: >
  `math.atan2()` returns the artangent of `x/y`, using the signs
  of the two to determine the quadrant of the return value.
menu:
  flux_v0_ref:
    name: math.atan2
    parent: math
    identifier: math/atan2
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L322-L322

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.atan2()` returns the artangent of `x/y`, using the signs
of the two to determine the quadrant of the return value.



##### Function type signature

```js
(x: float, y: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### y
({{< req >}})
y-coordinate to use in the operation.



### x
({{< req >}})
x-coordinate to use in the operation.



