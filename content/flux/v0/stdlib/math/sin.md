---
title: math.sin() function
description: >
  `math.sin()` returns the sine of the radian argument `x`.
menu:
  flux_v0_ref:
    name: math.sin
    parent: math
    identifier: math/sin
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1994-L1994

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.sin()` returns the sine of the radian argument `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Radian value to use in the operation.




## Examples

- [Return the sine of a radian value](#return-the-sine-of-a-radian-value)
- [Use math.sin in map](#use-mathsin-in-map)

### Return the sine of a radian value

```js
import "math"

math.sin(x: 3.14)// 0.0015926529164868282


```


### Use math.sin in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.sin(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -0.8201039476213742 | t1   |
| 2021-01-01T00:00:10Z | -0.9971456224759652 | t1   |
| 2021-01-01T00:00:20Z | 0.8756667135928823  | t1   |
| 2021-01-01T00:00:30Z | -0.9686047952311415 | t1   |
| 2021-01-01T00:00:40Z | 0.4599716480084409  | t1   |
| 2021-01-01T00:00:50Z | -0.9603924882355435 | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.8417108384451784  | t2   |
| 2021-01-01T00:00:10Z | -0.9670013802437661 | t2   |
| 2021-01-01T00:00:20Z | 0.5715613187423438  | t2   |
| 2021-01-01T00:00:30Z | 0.7958705732618963  | t2   |
| 2021-01-01T00:00:40Z | 0.9618345122584524  | t2   |
| 2021-01-01T00:00:50Z | 0.9584712830789142  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
