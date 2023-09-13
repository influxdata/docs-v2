---
title: logarithmicBins() function
description: >
  `logarithmicBins()` generates a list of exponentially separated float values.
menu:
  flux_v0_ref:
    name: logarithmicBins
    parent: universe
    identifier: universe/logarithmicBins
weight: 101

introduced: 0.19.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3634-L3634

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`logarithmicBins()` generates a list of exponentially separated float values.

Use `linearBins()` to generate bin bounds for `histogram()`.

##### Function type signature

```js
(count: int, factor: float, start: float, ?infinity: bool) => [float]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### start
({{< req >}})
First value to return in the list.



### factor
({{< req >}})
Multiplier to apply to subsequent values.



### count
({{< req >}})
Number of values to return.



### infinity

Include an infinite value at the end of the list. Default is `true`.




## Examples

### Generate a list of exponentially increasing values

```js
logarithmicBins(
    start: 1.0,
    factor: 2.0,
    count: 10,
    infinity: true,
)// Returns [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, +Inf]


```

