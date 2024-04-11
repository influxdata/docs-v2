---
title: math.erfinv() function
description: >
  `math.erfinv()` returns the inverse error function of `x`.
menu:
  flux_v0_ref:
    name: math.erfinv
    parent: math
    identifier: math/erfinv
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L723-L723

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.erfinv()` returns the inverse error function of `x`.



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

`x` should be greater than -1 and less than 1. Otherwise, the operation will
return `NaN`.


## Examples

- [Return the inverse error function of a value](#return-the-inverse-error-function-of-a-value)
- [Use math.erfinv in map](#use-matherfinv-in-map)

### Return the inverse error function of a value

```js
import "math"

math.erfinv(x: 0.22)// 0.19750838337227364


```


### Use math.erfinv in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.erfinv(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.9979506490526588 | t1   |
| 2021-01-01T00:00:10Z | 1                   | t1   |
| 2021-01-01T00:00:20Z | 1                   | t1   |
| 2021-01-01T00:00:30Z | 1                   | t1   |
| 2021-01-01T00:00:40Z | 1                   | t1   |
| 2021-01-01T00:00:50Z | 0.9999999996270934  | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 1                   | t2   |
| 2021-01-01T00:00:10Z | 0.9999999999979144  | t2   |
| 2021-01-01T00:00:20Z | -0.9999998862727434 | t2   |
| 2021-01-01T00:00:30Z | 1                   | t2   |
| 2021-01-01T00:00:40Z | 1                   | t2   |
| 2021-01-01T00:00:50Z | 0.9914724883356396  | t2   |


#### Output data

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | -2.1800000000000006 | t1   |
| 2021-01-01T00:00:10Z | +Inf                | t1   |
| 2021-01-01T00:00:20Z | +Inf                | t1   |
| 2021-01-01T00:00:30Z | +Inf                | t1   |
| 2021-01-01T00:00:40Z | +Inf                | t1   |
| 2021-01-01T00:00:50Z | 4.429999992395194   | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | +Inf                | t2   |
| 2021-01-01T00:00:10Z | 4.969999434158999   | t2   |
| 2021-01-01T00:00:20Z | -3.7499999999520366 | t2   |
| 2021-01-01T00:00:30Z | +Inf                | t2   |
| 2021-01-01T00:00:40Z | +Inf                | t2   |
| 2021-01-01T00:00:50Z | 1.860000000000001   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
