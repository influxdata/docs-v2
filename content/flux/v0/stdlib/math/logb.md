---
title: math.logb() function
description: >
  `math.logb()` returns the binary exponent of `x`.
menu:
  flux_v0_ref:
    name: math.logb
    parent: math
    identifier: math/logb
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1526-L1526

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.logb()` returns the binary exponent of `x`.



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

- [Return the binary exponent of a value](#return-the-binary-exponent-of-a-value)
- [Use math.logb in map](#use-mathlogb-in-map)

### Return the binary exponent of a value

```js
import "math"

math.logb(x: 3.14)// 1


```


### Use math.logb in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.logb(x: r._value)}))

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 1       | t1   |
| 2021-01-01T00:00:10Z | 3       | t1   |
| 2021-01-01T00:00:20Z | 2       | t1   |
| 2021-01-01T00:00:30Z | 4       | t1   |
| 2021-01-01T00:00:40Z | 3       | t1   |
| 2021-01-01T00:00:50Z | 2       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 4       | t2   |
| 2021-01-01T00:00:10Z | 2       | t2   |
| 2021-01-01T00:00:20Z | 1       | t2   |
| 2021-01-01T00:00:30Z | 4       | t2   |
| 2021-01-01T00:00:40Z | 3       | t2   |
| 2021-01-01T00:00:50Z | 0       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
