---
title: math.sinh() function
description: >
  `math.sinh()` returns the hyperbolic sine of `x`.
menu:
  flux_v0_ref:
    name: math.sinh
    parent: math
    identifier: math/sinh
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L2066-L2066

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.sinh()` returns the hyperbolic sine of `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Return the hyperbolic sine of a value](#return-the-hyperbolic-sine-of-a-value)
- [Use math.sinh in map](#use-mathsinh-in-map)

### Return the hyperbolic sine of a value

```js
import "math"

math.sinh(x: 1.23)// 1.564468479304407


```


### Use math.sinh in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.sinh(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -4.366632364040217 | t1   |
| 2021-01-01T00:00:10Z | 27635.399462538164 | t1   |
| 2021-01-01T00:00:20Z | 778.0979426223964  | t1   |
| 2021-01-01T00:00:30Z | 20518814.82310186  | t1   |
| 2021-01-01T00:00:40Z | 2057192.6487263965 | t1   |
| 2021-01-01T00:00:50Z | 41.95975121029801  | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 208792776.78651446  | t2   |
| 2021-01-01T00:00:10Z | 72.00997211144241   | t2   |
| 2021-01-01T00:00:20Z | -21.248782127103386 | t2   |
| 2021-01-01T00:00:30Z | 192740025.25908726  | t2   |
| 2021-01-01T00:00:40Z | 522746.9691817887   | t2   |
| 2021-01-01T00:00:50Z | 3.134032070530569   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
