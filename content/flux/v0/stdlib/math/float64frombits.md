---
title: math.float64frombits() function
description: >
  `math.float64frombits()` returns the floating-point number corresponding to the IEE
  754 binary representation `b`, with the sign bit of `b` and the result in the
  same bit position.
menu:
  flux_v0_ref:
    name: math.float64frombits
    parent: math
    identifier: math/float64frombits
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L882-L882

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.float64frombits()` returns the floating-point number corresponding to the IEE
754 binary representation `b`, with the sign bit of `b` and the result in the
same bit position.



##### Function type signature

```js
(b: uint) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### b
({{< req >}})
Value to operate on.




## Examples

- [Convert bits into a float value](#convert-bits-into-a-float-value)
- [Use math.float64frombits in map](#use-mathfloat64frombits-in-map)

### Convert bits into a float value

```js
import "math"

math.float64frombits(b: uint(v: 4))// 2e-323


```


### Use math.float64frombits in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.float64frombits(b: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

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


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2.18   | t1   |
| 2021-01-01T00:00:10Z | 10.92   | t1   |
| 2021-01-01T00:00:20Z | 7.35    | t1   |
| 2021-01-01T00:00:30Z | 17.53   | t1   |
| 2021-01-01T00:00:40Z | 15.23   | t1   |
| 2021-01-01T00:00:50Z | 4.43    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19.85   | t2   |
| 2021-01-01T00:00:10Z | 4.97    | t2   |
| 2021-01-01T00:00:20Z | -3.75   | t2   |
| 2021-01-01T00:00:30Z | 19.77   | t2   |
| 2021-01-01T00:00:40Z | 13.86   | t2   |
| 2021-01-01T00:00:50Z | 1.86    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
