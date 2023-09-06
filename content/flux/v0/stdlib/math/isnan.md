---
title: math.isNaN() function
description: >
  `math.isNaN()` reports whether `f` is an IEEE 754 "not-a-number" value.
menu:
  flux_v0_ref:
    name: math.isNaN
    parent: math
    identifier: math/isNaN
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1159-L1159

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.isNaN()` reports whether `f` is an IEEE 754 "not-a-number" value.



##### Function type signature

```js
(f: float) => bool
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### f
({{< req >}})
Value to operate on.




## Examples

- [Check if a value is a NaN float value](#check-if-a-value-is-a-nan-float-value)
- [Use math.isNaN in map](#use-mathisnan-in-map)

### Check if a value is a NaN float value

```js
import "math"

math.isNaN(f: 12.345)// false


```


### Use math.isNaN in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.isNaN(f: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | NaN     |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | NaN     |
| 2021-01-01T00:00:40Z | t1   | NaN     |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | NaN     |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | NaN     |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | false   | t1   |
| 2021-01-01T00:00:10Z | true    | t1   |
| 2021-01-01T00:00:20Z | false   | t1   |
| 2021-01-01T00:00:30Z | true    | t1   |
| 2021-01-01T00:00:40Z | true    | t1   |
| 2021-01-01T00:00:50Z | false   | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | true    | t2   |
| 2021-01-01T00:00:10Z | false   | t2   |
| 2021-01-01T00:00:20Z | false   | t2   |
| 2021-01-01T00:00:30Z | false   | t2   |
| 2021-01-01T00:00:40Z | true    | t2   |
| 2021-01-01T00:00:50Z | false   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
