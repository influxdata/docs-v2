---
title: math.atanh() function
description: >
  `math.atanh()` returns the inverse hyperbolic tangent of `x`.
menu:
  flux_0_x_ref:
    name: math.atanh
    parent: math
    identifier: math/atanh
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L363-L363

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.atanh()` returns the inverse hyperbolic tangent of `x`.



##### Function type signature

```js
math.atanh = (x: float) => float
```

## Parameters

### x

({{< req >}})
Value to operate on.`x` should be greater than -1 and less than 1. Otherwise the operation
will return `NaN`.


## Examples


### Return the hyperbolic tangent of a value

```js
import "math"

math.atanh(x: 0.22)// 0.22365610902183242

```


### Use math.atanh in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.atanh(x: r._value)}))
```

#### Input data

| _time                | _value                | *tag |
| -------------------- | --------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.021800000000000003 | t1   |
| 2021-01-01T00:00:10Z | 0.1092                | t1   |
| 2021-01-01T00:00:20Z | 0.0735                | t1   |
| 2021-01-01T00:00:30Z | 0.1753                | t1   |
| 2021-01-01T00:00:40Z | 0.15230000000000002   | t1   |
| 2021-01-01T00:00:50Z | 0.0443                | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.1985               | t2   |
| 2021-01-01T00:00:10Z | 0.0497               | t2   |
| 2021-01-01T00:00:20Z | -0.0375              | t2   |
| 2021-01-01T00:00:30Z | 0.1977               | t2   |
| 2021-01-01T00:00:40Z | 0.1386               | t2   |
| 2021-01-01T00:00:50Z | 0.018600000000000002 | t2   |


#### Output data

| _time                | _value                | *tag |
| -------------------- | --------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.021803454395720394 | t1   |
| 2021-01-01T00:00:10Z | 0.10963718917920522   | t1   |
| 2021-01-01T00:00:20Z | 0.07363278579671062   | t1   |
| 2021-01-01T00:00:30Z | 0.17712951464974935   | t1   |
| 2021-01-01T00:00:40Z | 0.1534942122028045    | t1   |
| 2021-01-01T00:00:50Z | 0.04432901360668446   | t1   |

| _time                | _value                | *tag |
| -------------------- | --------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.2011705409124157    | t2   |
| 2021-01-01T00:00:10Z | 0.049740981912241244  | t2   |
| 2021-01-01T00:00:20Z | -0.037517592971457035 | t2   |
| 2021-01-01T00:00:30Z | 0.20033786359692538   | t2   |
| 2021-01-01T00:00:40Z | 0.13949787194848565   | t2   |
| 2021-01-01T00:00:50Z | 0.01860214539735061   | t2   |

