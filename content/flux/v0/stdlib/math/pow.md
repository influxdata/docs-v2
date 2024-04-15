---
title: math.pow() function
description: >
  `math.pow()` returns `x**y`, the base-x exponential of `y`.
menu:
  flux_v0_ref:
    name: math.pow
    parent: math
    identifier: math/pow
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1796-L1796

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.pow()` returns `x**y`, the base-x exponential of `y`.



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
Base value to operate on.



### y
({{< req >}})
Exponent value.




## Examples

- [Return the base-x exponential of a value](#return-the-base-x-exponential-of-a-value)
- [Use math.pow in map](#use-mathpow-in-map)

### Return the base-x exponential of a value

```js
import "math"

math.pow(x: 2.0, y: 3.0)// 8.0


```


### Use math.pow in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.pow(x: r.t1, y: r.t2)}))

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

| _time                | _value                    |
| -------------------- | ------------------------- |
| 2021-01-01T00:00:00Z | NaN                       |
| 2021-01-01T00:00:10Z | 144532.83209763622        |
| 2021-01-01T00:00:20Z | 0.0005641862251143407     |
| 2021-01-01T00:00:30Z | 3886587782891166000000000 |
| 2021-01-01T00:00:40Z | 24672926229934220         |
| 2021-01-01T00:00:50Z | 15.933490684011332        |

{{% /expand %}}
{{< /expand-wrapper >}}
