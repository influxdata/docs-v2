---
title: math.remainder() function
description: >
  `math.remainder()` returns the IEEE 754 floating-point remainder of `x/y`.
menu:
  flux_v0_ref:
    name: math.remainder
    parent: math
    identifier: math/remainder
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1867-L1867

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.remainder()` returns the IEEE 754 floating-point remainder of `x/y`.



##### Function type signature

```js
(x: float, y: float) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Numerator to use in the operation.



### y
({{< req >}})
Denominator to use in the operation.




## Examples

- [Return the remainder of division between two values](#return-the-remainder-of-division-between-two-values)
- [Use math.remainder in map](#use-mathremainder-in-map)

### Return the remainder of division between two values

```js
import "math"

math.remainder(x: 21.0, y: 4.0)// 1.0


```


### Use math.remainder in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.remainder(x: r.t1, y: r.t2)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | t1    | t2    |
| -------------------- | ----- | ----- |
| 2021-01-01T00:00:00Z | -2.18 | 19.85 |
| 2021-01-01T00:00:10Z | 10.92 | 4.97  |
| 2021-01-01T00:00:20Z | 7.35  | -3.75 |
| 2021-01-01T00:00:30Z | 17.53 | 19.77 |
| 2021-01-01T00:00:40Z | 15.23 | 13.86 |
| 2021-01-01T00:00:50Z | 4.43  | 1.86  |


#### Output data

| _time                | _value               |
| -------------------- | -------------------- |
| 2021-01-01T00:00:00Z | -2.18                |
| 2021-01-01T00:00:10Z | 0.9800000000000004   |
| 2021-01-01T00:00:20Z | -0.15000000000000036 |
| 2021-01-01T00:00:30Z | -2.2399999999999984  |
| 2021-01-01T00:00:40Z | 1.370000000000001    |
| 2021-01-01T00:00:50Z | 0.7099999999999995   |

{{% /expand %}}
{{< /expand-wrapper >}}
