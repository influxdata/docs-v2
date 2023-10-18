---
title: math.float64bits() function
description: >
  `math.float64bits()` returns the IEEE 754 binary representation of `f`,
  with the sign bit of `f` and the result in the same bit position.
menu:
  flux_v0_ref:
    name: math.float64bits
    parent: math
    identifier: math/float64bits
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L853-L853

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.float64bits()` returns the IEEE 754 binary representation of `f`,
with the sign bit of `f` and the result in the same bit position.



##### Function type signature

```js
(f: float) => uint
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### f
({{< req >}})
Value to operate on.




## Examples

- [Return the binary expression of a value](#return-the-binary-expression-of-a-value)
- [Use math.float64bits in map](#use-mathfloat64bits-in-map)

### Return the binary expression of a value

```js
import "math"

math.float64bits(f: 1234.56)// 4653144467747100426


```


### Use math.float64bits in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.float64bits(f: r._value)}))

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

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 13835463379248627057 | t1   |
| 2021-01-01T00:00:10Z | 4622337031546119127  | t1   |
| 2021-01-01T00:00:20Z | 4619961382742681190  | t1   |
| 2021-01-01T00:00:30Z | 4625627474023866696  | t1   |
| 2021-01-01T00:00:40Z | 4624763345845364982  | t1   |
| 2021-01-01T00:00:50Z | 4616673755014700728  | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 4626280495969835418  | t2   |
| 2021-01-01T00:00:10Z | 4617281740964395745  | t2   |
| 2021-01-01T00:00:20Z | 13838998704956112896 | t2   |
| 2021-01-01T00:00:30Z | 4626257977971698565  | t2   |
| 2021-01-01T00:00:40Z | 4623992104409177784  | t2   |
| 2021-01-01T00:00:50Z | 4611055514479556035  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
