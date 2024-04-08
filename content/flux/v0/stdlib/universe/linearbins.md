---
title: linearBins() function
description: >
  `linearBins()` generates a list of linearly separated float values.
menu:
  flux_v0_ref:
    name: linearBins
    parent: universe
    identifier: universe/linearBins
weight: 101

introduced: 0.19.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3611-L3611

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`linearBins()` generates a list of linearly separated float values.

Use `linearBins()` to generate bin bounds for `histogram()`.

##### Function type signature

```js
(count: int, start: float, width: float, ?infinity: bool) => [float]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### start
({{< req >}})
First value to return in the list.



### width
({{< req >}})
Distance between subsequent values.



### count
({{< req >}})
Number of values to return.



### infinity

Include an infinite value at the end of the list. Default is `true`.




## Examples

### Generate a list of linearly increasing values

```js
linearBins(
    start: 0.0,
    width: 10.0,
    count: 10,
)// Returns [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, +Inf]


```

