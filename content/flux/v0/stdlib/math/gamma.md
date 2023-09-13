---
title: math.gamma() function
description: >
  `math.gamma()` returns the gamma function of `x`.
menu:
  flux_v0_ref:
    name: math.gamma
    parent: math
    identifier: math/gamma
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L993-L993

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.gamma()` returns the gamma function of `x`.



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

- [Return the gamma function of a value](#return-the-gamma-function-of-a-value)
- [Use math.gamma in map](#use-mathgamma-in-map)

### Return the gamma function of a value

```js
import "math"

math.gamma(x: 2.12)// 1.056821007887572


```


### Use math.gamma in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.gamma(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -2.4674191070057323 | t1   |
| 2021-01-01T00:00:10Z | 3007373.527042938   | t1   |
| 2021-01-01T00:00:20Z | 1399.634749015074   | t1   |
| 2021-01-01T00:00:30Z | 93234791408407.83   | t1   |
| 2021-01-01T00:00:40Z | 161558763355.0403   | t1   |
| 2021-01-01T00:00:50Z | 10.560583496997582  | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 77953108609300690   | t2   |
| 2021-01-01T00:00:10Z | 22.94201890526749   | t2   |
| 2021-01-01T00:00:20Z | 0.26786612886141653 | t2   |
| 2021-01-01T00:00:30Z | 61513013150171220   | t2   |
| 2021-01-01T00:00:40Z | 4328485003.951652   | t2   |
| 2021-01-01T00:00:50Z | 0.9486870416779484  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
