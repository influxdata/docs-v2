---
title: math.sincos() function
description: >
  `math.sincos()` returns the values of `math.sin(x:x)` and `math.cos(x:x)`.
menu:
  flux_v0_ref:
    name: math.sincos
    parent: math
    identifier: math/sincos
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L2033-L2033

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.sincos()` returns the values of `math.sin(x:x)` and `math.cos(x:x)`.



##### Function type signature

```js
(x: float) => {sin: float, cos: float}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Return the sine and cosine of a value](#return-the-sine-and-cosine-of-a-value)
- [Use math.sincos in map](#use-mathsincos-in-map)

### Return the sine and cosine of a value

```js
import "math"

math.sincos(x: 1.23)// {cos: 0.3342377271245026, sin: 0.9424888019316975}


```


### Use math.sincos in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(
        fn: (r) => {
            result = math.sincos(x: r._value)

            return {_time: r._time, tag: r._tag, sin: result.sin, cos: result.cos}
        },
    )

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

| _time                | cos                  | sin                 |
| -------------------- | -------------------- | ------------------- |
| 2021-01-01T00:00:00Z | -0.5722145708524368  | -0.8201039476213742 |
| 2021-01-01T00:00:10Z | -0.07550236802260023 | -0.9971456224759652 |
| 2021-01-01T00:00:20Z | 0.4829159416559379   | 0.8756667135928823  |
| 2021-01-01T00:00:30Z | 0.248605612678472    | -0.9686047952311415 |
| 2021-01-01T00:00:40Z | -0.887933602826472   | 0.4599716480084409  |
| 2021-01-01T00:00:50Z | -0.2786508003590546  | -0.9603924882355435 |
| 2021-01-01T00:00:00Z | 0.5399285734649675   | 0.8417108384451784  |
| 2021-01-01T00:00:10Z | 0.25477113377824295  | -0.9670013802437661 |
| 2021-01-01T00:00:20Z | -0.8205593573395606  | 0.5715613187423438  |
| 2021-01-01T00:00:30Z | 0.6054667873763024   | 0.7958705732618963  |
| 2021-01-01T00:00:40Z | 0.2736318165501685   | 0.9618345122584524  |
| 2021-01-01T00:00:50Z | -0.28518905924502086 | 0.9584712830789142  |

{{% /expand %}}
{{< /expand-wrapper >}}
