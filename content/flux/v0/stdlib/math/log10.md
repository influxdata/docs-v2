---
title: math.log10() function
description: >
  `math.log10()` returns the decimal logarithm of x.
menu:
  flux_v0_ref:
    name: math.log10
    parent: math
    identifier: math/log10
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1418-L1418

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.log10()` returns the decimal logarithm of x.



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

- [Return the decimal lagarithm of a value](#return-the-decimal-lagarithm-of-a-value)
- [Use math.log10 in map](#use-mathlog10-in-map)

### Return the decimal lagarithm of a value

```js
import "math"

math.log10(x: 3.14)// 0.4969296480732149


```


### Use math.log10 in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.log10(x: r._value)}))

```

