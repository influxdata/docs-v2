---
title: math.atan() function
description: >
  `math.atan()` returns the arctangent of `x` in radians.
menu:
  flux_v0_ref:
    name: math.atan
    parent: math
    identifier: math/atan
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L263-L263

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.atan()` returns the arctangent of `x` in radians.



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

- [Return the arctangent of a value](#return-the-arctangent-of-a-value)
- [Use math.atan in map](#use-mathatan-in-map)

### Return the arctangent of a value

```js
import "math"

math.atan(x: 3.14)// 1.262480664599468


```


### Use math.atan in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.atan(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -1.140718191739034 | t1   |
| 2021-01-01T00:00:10Z | 1.4794759377086963 | t1   |
| 2021-01-01T00:00:20Z | 1.4355721950708649 | t1   |
| 2021-01-01T00:00:30Z | 1.5138130181922385 | t1   |
| 2021-01-01T00:00:40Z | 1.5052305597197282 | t1   |
| 2021-01-01T00:00:50Z | 1.3487837105541014 | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 1.5204610466686876  | t2   |
| 2021-01-01T00:00:10Z | 1.3722402258799695  | t2   |
| 2021-01-01T00:00:20Z | -1.3101939350475555 | t2   |
| 2021-01-01T00:00:30Z | 1.520257709140084   | t2   |
| 2021-01-01T00:00:40Z | 1.4987710606562659  | t2   |
| 2021-01-01T00:00:50Z | 1.0774963946058176  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
