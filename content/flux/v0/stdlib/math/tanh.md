---
title: math.tanh() function
description: >
  `math.tanh()` returns the hyperbolic tangent of `x`.
menu:
  flux_v0_ref:
    name: math.tanh
    parent: math
    identifier: math/tanh
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L2166-L2166

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.tanh()` returns the hyperbolic tangent of `x`.



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

- [Return the hyperbolic tangent of a value](#return-the-hyperbolic-tangent-of-a-value)
- [Use math.tanh in map](#use-mathtanh-in-map)

### Return the hyperbolic tangent of a value

```js
import "math"

math.tanh(x: 1.23)// 0.8425793256589296


```


### Use math.tanh in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.tanh(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.9747656786413226 | t1   |
| 2021-01-01T00:00:10Z | 0.9999999993453058  | t1   |
| 2021-01-01T00:00:20Z | 0.9999991741504578  | t1   |
| 2021-01-01T00:00:30Z | 0.9999999999999988  | t1   |
| 2021-01-01T00:00:40Z | 0.9999999999998819  | t1   |
| 2021-01-01T00:00:50Z | 0.9997161301684341  | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 1                   | t2   |
| 2021-01-01T00:00:10Z | 0.9999035900383996  | t2   |
| 2021-01-01T00:00:20Z | -0.9988944427261528 | t2   |
| 2021-01-01T00:00:30Z | 1                   | t2   |
| 2021-01-01T00:00:40Z | 0.9999999999981702  | t2   |
| 2021-01-01T00:00:50Z | 0.9526788436890776  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
