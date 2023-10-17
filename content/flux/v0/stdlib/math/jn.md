---
title: math.jn() function
description: >
  `math.jn()` returns the order-n Bessel funciton of the first kind.
menu:
  flux_v0_ref:
    name: math.jn
    parent: math
    identifier: math/jn
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1257-L1257

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.jn()` returns the order-n Bessel funciton of the first kind.



##### Function type signature

```js
(n: int, x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Order number.



### x
({{< req >}})
Value to operate on.




## Examples

- [Return the order-n Bessel function of a value](#return-the-order-n-bessel-function-of-a-value)
- [Use math.jn in map](#use-mathjn-in-map)

### Return the order-n Bessel function of a value

```js
import "math"

math.jn(n: 2, x: 1.23)// 0.16636938378681407


```


### Use math.jn in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.jn(n: 4, x: r._value)}))

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

| _time                | _value                | *tag |
| -------------------- | --------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.046148335742456664  | t1   |
| 2021-01-01T00:00:10Z | -0.03367382202216673  | t1   |
| 2021-01-01T00:00:20Z | 0.06455053599079605   | t1   |
| 2021-01-01T00:00:30Z | -0.016152633110842446 | t1   |
| 2021-01-01T00:00:40Z | -0.15300380439231542  | t1   |
| 2021-01-01T00:00:50Z | 0.3401384178914538    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.14801732445932958  | t2   |
| 2021-01-01T00:00:10Z | 0.3896093468299793   | t2   |
| 2021-01-01T00:00:20Z | 0.24301709268606153  | t2   |
| 2021-01-01T00:00:30Z | 0.15603599253486927  | t2   |
| 2021-01-01T00:00:40Z | 0.10341672446511223  | t2   |
| 2021-01-01T00:00:50Z | 0.026150267042506597 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
