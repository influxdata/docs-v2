---
title: math.acosh() function
description: >
  `math.acosh()` returns the inverse hyperbolic cosine of `x`.
menu:
  flux_0_x_ref:
    name: math.acosh
    parent: math
    identifier: math/acosh
weight: 101
aliases:
  - /influxdb/v2.0/reference/flux/functions/math/acosh/
  - /influxdb/v2.0/reference/flux/stdlib/math/acosh/
  - /influxdb/cloud/reference/flux/stdlib/math/acosh/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L160-L160

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.acosh()` returns the inverse hyperbolic cosine of `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.

`x` should be greater than 1. If less than 1 the operation will return `NaN`.


## Examples

- [Return the inverse hyperbolic cosine of a value](#return-the-inverse-hyperbolic-cosine-of-a-value)
- [Use math.acosh in map](#use-mathacosh-in-map)

### Return the inverse hyperbolic cosine of a value

```js
import "math"

math.acosh(x: 1.22)

```


### Use math.acosh in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.acosh(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.21800000000000003 | t1   |
| 2021-01-01T00:00:10Z | 1.092                | t1   |
| 2021-01-01T00:00:20Z | 0.735                | t1   |
| 2021-01-01T00:00:30Z | 1.7530000000000001   | t1   |
| 2021-01-01T00:00:40Z | 1.5230000000000001   | t1   |
| 2021-01-01T00:00:50Z | 0.443                | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 1.9850000000000003  | t2   |
| 2021-01-01T00:00:10Z | 0.497               | t2   |
| 2021-01-01T00:00:20Z | -0.375              | t2   |
| 2021-01-01T00:00:30Z | 1.977               | t2   |
| 2021-01-01T00:00:40Z | 1.3860000000000001  | t2   |
| 2021-01-01T00:00:50Z | 0.18600000000000003 | t2   |


#### Output data

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | NaN                 | t1   |
| 2021-01-01T00:00:10Z | 0.42572984537574377 | t1   |
| 2021-01-01T00:00:20Z | NaN                 | t1   |
| 2021-01-01T00:00:30Z | 1.1608966388962805  | t1   |
| 2021-01-01T00:00:40Z | 0.9827177940622978  | t1   |
| 2021-01-01T00:00:50Z | NaN                 | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 1.308254013849232  | t2   |
| 2021-01-01T00:00:10Z | NaN                | t2   |
| 2021-01-01T00:00:20Z | NaN                | t2   |
| 2021-01-01T00:00:30Z | 1.3035758471451702 | t2   |
| 2021-01-01T00:00:40Z | 0.8525776257667146 | t2   |
| 2021-01-01T00:00:50Z | NaN                | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
