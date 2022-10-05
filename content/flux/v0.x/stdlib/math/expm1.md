---
title: math.expm1() function
description: >
  `math.expm1()` returns `e**x - 1`, the base-e exponential of `x` minus 1.
  It is more accurate than `math.exp(x:x) - 1` when `x` is near zero.
menu:
  flux_0_x_ref:
    name: math.expm1
    parent: math
    identifier: math/expm1
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L827-L827

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.expm1()` returns `e**x - 1`, the base-e exponential of `x` minus 1.
It is more accurate than `math.exp(x:x) - 1` when `x` is near zero.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Get more accurate base-e exponentials for values near zero](#get-more-accurate-base-e-exponentials-for-values-near-zero)
- [Use math.expm1 in map](#use-mathexpm1-in-map)

### Get more accurate base-e exponentials for values near zero

```js
import "math"

math.expm1(x: 0.022)// 0.022243784470438233


```


### Use math.expm1 in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.expm1(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | *tag | _value                |
| -------------------- | ---- | --------------------- |
| 2021-01-01T00:00:00Z | t1   | -0.021800000000000003 |
| 2021-01-01T00:00:10Z | t1   | 0.1092                |
| 2021-01-01T00:00:20Z | t1   | 0.0735                |
| 2021-01-01T00:00:30Z | t1   | 0.1753                |
| 2021-01-01T00:00:40Z | t1   | 0.15230000000000002   |
| 2021-01-01T00:00:50Z | t1   | 0.0443                |

| _time                | *tag | _value               |
| -------------------- | ---- | -------------------- |
| 2021-01-01T00:00:00Z | t2   | 0.1985               |
| 2021-01-01T00:00:10Z | t2   | 0.0497               |
| 2021-01-01T00:00:20Z | t2   | -0.0375              |
| 2021-01-01T00:00:30Z | t2   | 0.1977               |
| 2021-01-01T00:00:40Z | t2   | 0.1386               |
| 2021-01-01T00:00:50Z | t2   | 0.018600000000000002 |


#### Output data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.02156409733567063 | t1   |
| 2021-01-01T00:00:10Z | 0.11538540511625006  | t1   |
| 2021-01-01T00:00:20Z | 0.07626853667189179  | t1   |
| 2021-01-01T00:00:30Z | 0.1916036440887826   | t1   |
| 2021-01-01T00:00:40Z | 0.16450953689549175  | t1   |
| 2021-01-01T00:00:50Z | 0.045295896623819054 | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.21957202741425103  | t2   |
| 2021-01-01T00:00:10Z | 0.05095576234958021  | t2   |
| 2021-01-01T00:00:20Z | -0.03680558227917823 | t2   |
| 2021-01-01T00:00:30Z | 0.21859675995131905  | t2   |
| 2021-01-01T00:00:40Z | 0.14866454228127554  | t2   |
| 2021-01-01T00:00:50Z | 0.018774057481622756 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
