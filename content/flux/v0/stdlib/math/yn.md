---
title: math.yn() function
description: >
  `math.yn()` returns the order-n Bessel function of the second kind.
menu:
  flux_v0_ref:
    name: math.yn
    parent: math
    identifier: math/yn
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L2313-L2313

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.yn()` returns the order-n Bessel function of the second kind.



##### Function type signature

```js
(n: int, x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Order number to use in the operation.



### x
({{< req >}})
Value to operate on.




## Examples

- [Return the order-n Bessel function of a value](#return-the-order-n-bessel-function-of-a-value)
- [Use math.yn in map](#use-mathyn-in-map)

### Return the order-n Bessel function of a value

```js
import "math"

math.yn(n: 3, x: 3.14)// -0.4866506930335083


```


### Use math.yn in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.yn(n: r.n, x: r.x)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | x   | n  |
| -------------------- | --- | -- |
| 2021-01-01T00:00:00Z | 1.2 | 3  |
| 2021-01-01T01:00:00Z | 2.4 | 4  |
| 2021-01-01T02:00:00Z | 3.6 | 5  |
| 2021-01-01T03:00:00Z | 4.8 | 6  |
| 2021-01-01T04:00:00Z | 5.1 | 7  |


#### Output data

| _time                | _value              |
| -------------------- | ------------------- |
| 2021-01-01T00:00:00Z | -3.589899629613186  |
| 2021-01-01T01:00:00Z | -1.6023565737844263 |
| 2021-01-01T02:00:00Z | -1.0581497196727103 |
| 2021-01-01T03:00:00Z | -0.8050704522628885 |
| 2021-01-01T04:00:00Z | -1.1643613692219157 |

{{% /expand %}}
{{< /expand-wrapper >}}
