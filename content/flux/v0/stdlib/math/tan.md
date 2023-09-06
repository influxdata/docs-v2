---
title: math.tan() function
description: >
  `math.tan()` returns the tangent of the radian argument `x`.
menu:
  flux_v0_ref:
    name: math.tan
    parent: math
    identifier: math/tan
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L2133-L2133

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.tan()` returns the tangent of the radian argument `x`.



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

- [Return the tangent of a radian value](#return-the-tangent-of-a-radian-value)
- [Use math.tan in map](#use-mathtan-in-map)

### Return the tangent of a radian value

```js
import "math"

math.tan(x: 3.14)// -0.001592654936407223


```


### Use math.tan in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.tan(x: r._value)}))

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

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 1.4332105287001917  | t1   |
| 2021-01-01T00:00:10Z | 13.206812562189944  | t1   |
| 2021-01-01T00:00:20Z | 1.8132901361470621  | t1   |
| 2021-01-01T00:00:30Z | -3.8961501504145963 | t1   |
| 2021-01-01T00:00:40Z | -0.5180248236402568 | t1   |
| 2021-01-01T00:00:50Z | 3.446580763443108   | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 1.5589299766884657  | t2   |
| 2021-01-01T00:00:10Z | -3.7955688539089367 | t2   |
| 2021-01-01T00:00:20Z | -0.6965508511114601 | t2   |
| 2021-01-01T00:00:30Z | 1.3144743689586664  | t2   |
| 2021-01-01T00:00:40Z | 3.515068256260714   | t2   |
| 2021-01-01T00:00:50Z | -3.3608276755646553 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
