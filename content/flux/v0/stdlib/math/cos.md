---
title: math.cos() function
description: >
  `math.cos()` returns the cosine of the radian argument `x`.
menu:
  flux_v0_ref:
    name: math.cos
    parent: math
    identifier: math/cos
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L497-L497

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.cos()` returns the cosine of the radian argument `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

### Use math.cos in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({_time: r._time, _value: math.cos(x: r._value)}))

```

