---
title: math.asin() function
description: >
  `math.asin()` returns the arcsine of `x` in radians.
menu:
  flux_0_x_ref:
    name: math.asin
    parent: math
    identifier: math/asin
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L198-L198

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.asin()` returns the arcsine of `x` in radians.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.

`x` should be greater than -1 and less than 1. Otherwise the function will
return `NaN`.


## Examples

- [Return the arcsine of a value](#return-the-arcsine-of-a-value)
- [Use math.asin in map](#use-mathasin-in-map)

### Return the arcsine of a value

```js
import "math"

math.asin(x: 0.22)

```


### Use math.asin in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.asin(x: r._value)}))

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

| _time                | _value                | *tag |
| -------------------- | --------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.021801727074707577 | t1   |
| 2021-01-01T00:00:10Z | 0.10941820137571553   | t1   |
| 2021-01-01T00:00:20Z | 0.07356633896021608   | t1   |
| 2021-01-01T00:00:30Z | 0.17621047844966892   | t1   |
| 2021-01-01T00:00:40Z | 0.1528950055407725    | t1   |
| 2021-01-01T00:00:50Z | 0.044314502528968014  | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.1998272282367503   | t2   |
| 2021-01-01T00:00:10Z | 0.04972048335509017  | t2   |
| 2021-01-01T00:00:20Z | -0.03750879462898862 | t2   |
| 2021-01-01T00:00:30Z | 0.19901105310181802  | t2   |
| 2021-01-01T00:00:40Z | 0.13904763050983682  | t2   |
| 2021-01-01T00:00:50Z | 0.0186010726429996   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
