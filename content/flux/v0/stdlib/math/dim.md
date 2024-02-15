---
title: math.dim() function
description: >
  `math.dim()` returns the maximum of `x - y` or `0`.
menu:
  flux_v0_ref:
    name: math.dim
    parent: math
    identifier: math/dim
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L575-L575

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.dim()` returns the maximum of `x - y` or `0`.



##### Function type signature

```js
(x: float, y: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
x-value to use in the operation.



### y
({{< req >}})
y-value to use in the operation.




## Examples

- [Return the maximum difference between two values](#return-the-maximum-difference-between-two-values)
- [Use math.dim in map](#use-mathdim-in-map)

### Return the maximum difference between two values

```js
import "math"

math.dim(x: 12.2, y: 8.1)// 4.1


```


### Use math.dim in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.dim(x: r.x, y: r.y)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | x   | y   |
| -------------------- | --- | --- |
| 2021-01-01T00:00:00Z | 3.9 | 1.2 |
| 2021-01-01T01:00:00Z | 4.2 | 2.4 |
| 2021-01-01T02:00:00Z | 5.3 | 3.6 |
| 2021-01-01T03:00:00Z | 6.8 | 4.8 |
| 2021-01-01T04:00:00Z | 7.5 | 5.1 |


#### Output data

| _time                | _value             |
| -------------------- | ------------------ |
| 2021-01-01T00:00:00Z | 2.7                |
| 2021-01-01T01:00:00Z | 1.8000000000000003 |
| 2021-01-01T02:00:00Z | 1.6999999999999997 |
| 2021-01-01T03:00:00Z | 2                  |
| 2021-01-01T04:00:00Z | 2.4000000000000004 |

{{% /expand %}}
{{< /expand-wrapper >}}
