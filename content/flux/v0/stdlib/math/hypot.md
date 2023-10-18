---
title: math.hypot() function
description: >
  `math.hypot()` returns the square root of `p*p + q*q`, taking care to avoid overflow
  and underflow.
menu:
  flux_v0_ref:
    name: math.hypot
    parent: math
    identifier: math/hypot
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1039-L1039

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.hypot()` returns the square root of `p*p + q*q`, taking care to avoid overflow
and underflow.



##### Function type signature

```js
(p: float, q: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### p
({{< req >}})
p-value to use in the operation.



### q
({{< req >}})
q-value to use in the operation.




## Examples

- [Return the hypotenuse of two values](#return-the-hypotenuse-of-two-values)
- [Use math.hypot in map](#use-mathhypot-in-map)

### Return the hypotenuse of two values

```js
import "math"

math.hypot(p: 2.0, q: 5.0)// 5.385164807134505


```


### Use math.hypot in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.hypot(p: r.a, q: r.b)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| triangle  | a     | b    |
| --------- | ----- | ---- |
| t1        | 12.3  | 11.7 |
| t2        | 109.6 | 23.3 |
| t3        | 8.2   | 34.2 |
| t4        | 33.9  | 28   |
| t5        | 25    | 25   |


#### Output data

| _value             | a     | b    | triangle  |
| ------------------ | ----- | ---- | --------- |
| 16.975865220954127 | 12.3  | 11.7 | t1        |
| 112.04931949815669 | 109.6 | 23.3 | t2        |
| 35.16930479836074  | 8.2   | 34.2 | t3        |
| 43.9682840238279   | 33.9  | 28   | t4        |
| 35.35533905932738  | 25    | 25   | t5        |

{{% /expand %}}
{{< /expand-wrapper >}}
