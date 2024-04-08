---
title: math.log() function
description: >
  `math.log()` returns the natural logarithm of `x`.
menu:
  flux_v0_ref:
    name: math.log
    parent: math
    identifier: math/log
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1384-L1384

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.log()` returns the natural logarithm of `x`.



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

- [Return the natural logarithm of a value](#return-the-natural-logarithm-of-a-value)
- [Use math.log in map](#use-mathlog-in-map)

### Return the natural logarithm of a value

```js
import "math"

math.log(x: 3.14)// 1.144222799920162


```


### Use math.log in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.log(x: r._value)}))

```

