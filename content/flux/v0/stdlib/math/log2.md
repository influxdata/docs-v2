---
title: math.log2() function
description: >
  `math.log2()` is a function returns the binary logarithm of `x`.
menu:
  flux_v0_ref:
    name: math.log2
    parent: math
    identifier: math/log2
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1493-L1493

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.log2()` is a function returns the binary logarithm of `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
the value used in the operation.




## Examples

- [Return the binary logarithm of a value](#return-the-binary-logarithm-of-a-value)
- [Use math.log2 in map](#use-mathlog2-in-map)

### Return the binary logarithm of a value

```js
import "math"

math.log2(x: 3.14)// 1.6507645591169022


```


### Use math.log2 in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.log2(x: r._value)}))

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
| 2021-01-01T00:00:10Z | 3.4489009511451276 | t1   |
| 2021-01-01T00:00:20Z | 2.877744249949002  | t1   |
| 2021-01-01T00:00:30Z | 4.131754090984813  | t1   |
| 2021-01-01T00:00:40Z | 3.9288440367125674 | t1   |
| 2021-01-01T00:00:50Z | 2.1473066987802936 | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 4.3110671022555955 | t2   |
| 2021-01-01T00:00:10Z | 2.3132458517875616 | t2   |
| 2021-01-01T00:00:20Z | NaN                | t2   |
| 2021-01-01T00:00:30Z | 4.305240965954483  | t2   |
| 2021-01-01T00:00:40Z | 3.792855352362489  | t2   |
| 2021-01-01T00:00:50Z | 0.8953026213333067 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
