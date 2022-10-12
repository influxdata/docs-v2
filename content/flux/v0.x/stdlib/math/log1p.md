---
title: math.log1p() function
description: >
  `math.log1p()` returns the natural logarithm of 1 plus `x`.
  This operation is more accurate than `math.log(x: 1 + x)` when `x` is
  near zero.
menu:
  flux_0_x_ref:
    name: math.log1p
    parent: math
    identifier: math/log1p
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1459-L1459

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.log1p()` returns the natural logarithm of 1 plus `x`.
This operation is more accurate than `math.log(x: 1 + x)` when `x` is
near zero.



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

- [Return the natural logarithm of values near zero](#return-the-natural-logarithm-of-values-near-zero)
- [Use math.log1p in map](#use-mathlog1p-in-map)

### Return the natural logarithm of values near zero

```js
import "math"

math.log1p(x: 0.56)// 0.44468582126144574


```


### Use math.log1p in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.log1p(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -0.02204113087688024 | t1   |
| 2021-01-01T00:00:10Z | 0.10363903475948592  | t1   |
| 2021-01-01T00:00:20Z | 0.07092433833669866  | t1   |
| 2021-01-01T00:00:30Z | 0.1615234341566714   | t1   |
| 2021-01-01T00:00:40Z | 0.14175994503783176  | t1   |
| 2021-01-01T00:00:50Z | 0.04334680450336586  | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.181070774892302    | t2   |
| 2021-01-01T00:00:10Z | 0.048504409059614985 | t2   |
| 2021-01-01T00:00:20Z | -0.03822121282019776 | t2   |
| 2021-01-01T00:00:30Z | 0.18040305097132403  | t2   |
| 2021-01-01T00:00:40Z | 0.12979943753484446  | t2   |
| 2021-01-01T00:00:50Z | 0.018429135468367195 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
