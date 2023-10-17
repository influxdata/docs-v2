---
title: math.asinh() function
description: >
  `math.asinh()` returns the inverse hyperbolic sine of `x`.
menu:
  flux_v0_ref:
    name: math.asinh
    parent: math
    identifier: math/asinh
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L231-L231

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.asinh()` returns the inverse hyperbolic sine of `x`.



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

- [Return the inverse hyperbolic sine of a value](#return-the-inverse-hyperbolic-sine-of-a-value)
- [Use math.asinh in map](#use-mathasinh-in-map)

### Return the inverse hyperbolic sine of a value

```js
import "math"

math.asinh(x: 3.14)// 1.8618125572133835


```


### Use math.asinh in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.asinh(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -1.5213531182383162 | t1   |
| 2021-01-01T00:00:10Z | 3.0858330878095224  | t1   |
| 2021-01-01T00:00:20Z | 2.692443398164797   | t1   |
| 2021-01-01T00:00:30Z | 3.5578734234029126  | t1   |
| 2021-01-01T00:00:40Z | 3.4174904141531415  | t1   |
| 2021-01-01T00:00:50Z | 2.1940489315838474  | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 3.681985066226324   | t2   |
| 2021-01-01T00:00:10Z | 2.3065378213935075  | t2   |
| 2021-01-01T00:00:20Z | -2.0322246215338136 | t2   |
| 2021-01-01T00:00:30Z | 3.6779518317559377  | t2   |
| 2021-01-01T00:00:40Z | 3.323453049376607   | t2   |
| 2021-01-01T00:00:50Z | 1.3792134765550192  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
