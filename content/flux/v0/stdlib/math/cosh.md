---
title: math.cosh() function
description: >
  `math.cosh()` returns the hyperbolic cosine of `x`.
menu:
  flux_v0_ref:
    name: math.cosh
    parent: math
    identifier: math/cosh
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L530-L530

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.cosh()` returns the hyperbolic cosine of `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

### Use math.cosh in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({_time: r._time, _value: math.cosh(x: r._value)}))

```

