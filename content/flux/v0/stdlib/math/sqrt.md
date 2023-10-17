---
title: math.sqrt() function
description: >
  `math.sqrt()` returns the square root of `x`.
menu:
  flux_v0_ref:
    name: math.sqrt
    parent: math
    identifier: math/sqrt
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L2100-L2100

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.sqrt()` returns the square root of `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Return the square root of a value](#return-the-square-root-of-a-value)
- [Use math.sqrt in map](#use-mathsqrt-in-map)

### Return the square root of a value

```js
import "math"

math.sqrt(x: 4.0)// 2.0


```


### Use math.sqrt in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.sqrt(x: r._value)}))

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

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | NaN                | t1   |
| 2021-01-01T00:00:10Z | 3.304542328371661  | t1   |
| 2021-01-01T00:00:20Z | 2.711088342345192  | t1   |
| 2021-01-01T00:00:30Z | 4.186884283091665  | t1   |
| 2021-01-01T00:00:40Z | 3.9025632602175713 | t1   |
| 2021-01-01T00:00:50Z | 2.1047565179849186 | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 4.455333881989093  | t2   |
| 2021-01-01T00:00:10Z | 2.2293496809607953 | t2   |
| 2021-01-01T00:00:20Z | NaN                | t2   |
| 2021-01-01T00:00:30Z | 4.446346815083142  | t2   |
| 2021-01-01T00:00:40Z | 3.722902093797257  | t2   |
| 2021-01-01T00:00:50Z | 1.3638181696985856 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
