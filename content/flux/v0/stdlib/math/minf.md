---
title: math.mInf() function
description: >
  `math.mInf()` returns positive infinity if `sign >= 0`, negative infinity
  if `sign < 0`.
menu:
  flux_v0_ref:
    name: math.mInf
    parent: math
    identifier: math/mInf
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1098-L1098

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.mInf()` returns positive infinity if `sign >= 0`, negative infinity
if `sign < 0`.



##### Function type signature

```js
(sign: int) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### sign
({{< req >}})
Value to operate on.




## Examples

- [Return an infinity float value from a positive or negative sign value](#return-an-infinity-float-value-from-a-positive-or-negative-sign-value)
- [Use math.mInf in map](#use-mathminf-in-map)

### Return an infinity float value from a positive or negative sign value

```js
import "math"

math.mInf(sign: 1)// +Inf


```


### Use math.mInf in map

```js
import "sampledata"
import "math"

sampledata.int()
    |> map(fn: (r) => ({r with _value: math.mInf(sign: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -Inf    | t1   |
| 2021-01-01T00:00:10Z | +Inf    | t1   |
| 2021-01-01T00:00:20Z | +Inf    | t1   |
| 2021-01-01T00:00:30Z | +Inf    | t1   |
| 2021-01-01T00:00:40Z | +Inf    | t1   |
| 2021-01-01T00:00:50Z | +Inf    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | +Inf    | t2   |
| 2021-01-01T00:00:10Z | +Inf    | t2   |
| 2021-01-01T00:00:20Z | -Inf    | t2   |
| 2021-01-01T00:00:30Z | +Inf    | t2   |
| 2021-01-01T00:00:40Z | +Inf    | t2   |
| 2021-01-01T00:00:50Z | +Inf    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
