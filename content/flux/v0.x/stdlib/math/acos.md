---
title: math.acos() function
description: >
  `math.acos()` returns the acosine of `x` in radians.
menu:
  flux_0_x_ref:
    name: math.acos
    parent: math
    identifier: math/acos
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L123-L123

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.acos()` returns the acosine of `x` in radians.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.

`x` should be greater than -1 and less than 1. Otherwise, the operation
will return `NaN`.


## Examples

- [Return the acosine of a value](#return-the-acosine-of-a-value)
- [Use math.acos in map](#use-mathacos-in-map)

### Return the acosine of a value

```js
import "math"

math.acos(x: 0.22)// 1.3489818562981022


```


### Use math.acos in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.acos(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

#### Input data

| _time                | *tag | _value                |
| -------------------- | ---- | --------------------- |
| 2021-01-01T00:00:00Z | t1   | -0.021800000000000003 |
| 2021-01-01T00:00:10Z | t1   | 0.1092                |
| 2021-01-01T00:00:20Z | t1   | 0.0735                |
| 2021-01-01T00:00:30Z | t1   | 0.1753                |
| 2021-01-01T00:00:40Z | t1   | 0.15230000000000002   |
| 2021-01-01T00:00:50Z | t1   | 0.0443                |

| _time                | *tag | _value               |
| -------------------- | ---- | -------------------- |
| 2021-01-01T00:00:00Z | t2   | 0.1985               |
| 2021-01-01T00:00:10Z | t2   | 0.0497               |
| 2021-01-01T00:00:20Z | t2   | -0.0375              |
| 2021-01-01T00:00:30Z | t2   | 0.1977               |
| 2021-01-01T00:00:40Z | t2   | 0.1386               |
| 2021-01-01T00:00:50Z | t2   | 0.018600000000000002 |


#### Output data

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 1.592598053869604  | t1   |
| 2021-01-01T00:00:10Z | 1.461378125419181  | t1   |
| 2021-01-01T00:00:20Z | 1.4972299878346804 | t1   |
| 2021-01-01T00:00:30Z | 1.3945858483452276 | t1   |
| 2021-01-01T00:00:40Z | 1.417901321254124  | t1   |
| 2021-01-01T00:00:50Z | 1.5264818242659286 | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 1.3709690985581462 | t2   |
| 2021-01-01T00:00:10Z | 1.5210758434398064 | t2   |
| 2021-01-01T00:00:20Z | 1.6083051214238853 | t2   |
| 2021-01-01T00:00:30Z | 1.3717852736930785 | t2   |
| 2021-01-01T00:00:40Z | 1.4317486962850596 | t2   |
| 2021-01-01T00:00:50Z | 1.5521952541518969 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
