---
title: math.exp() function
description: >
  `math.exp()` returns `e**x`, the base-e exponential of `x`.
menu:
  flux_v0_ref:
    name: math.exp
    parent: math
    identifier: math/exp
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L755-L755

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.exp()` returns `e**x`, the base-e exponential of `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Return the base-e exponential of a value](#return-the-base-e-exponential-of-a-value)
- [Use math.exp in map](#use-mathexp-in-map)

### Return the base-e exponential of a value

```js
import "math"

math.exp(x: 21.0)// 1.3188157344832146e+09


```


### Use math.exp in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.exp(x: r._value)}))

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
| 2021-01-01T00:00:00Z | 0.11304153064044985 | t1   |
| 2021-01-01T00:00:10Z | 55270.798943169066  | t1   |
| 2021-01-01T00:00:20Z | 1556.1965278371533  | t1   |
| 2021-01-01T00:00:30Z | 41037629.64620374   | t1   |
| 2021-01-01T00:00:40Z | 4114385.297453036   | t1   |
| 2021-01-01T00:00:50Z | 83.93141691026881   | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 417585553.5730289    | t2   |
| 2021-01-01T00:00:10Z | 144.02688737091955   | t2   |
| 2021-01-01T00:00:20Z | 0.023517745856009107 | t2   |
| 2021-01-01T00:00:30Z | 385480050.5181745    | t2   |
| 2021-01-01T00:00:40Z | 1045493.9383645338   | t2   |
| 2021-01-01T00:00:50Z | 6.423736771429135    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
