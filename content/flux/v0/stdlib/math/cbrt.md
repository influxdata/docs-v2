---
title: math.cbrt() function
description: >
  `math.cbrt()` returns the cube root of x.
menu:
  flux_v0_ref:
    name: math.cbrt
    parent: math
    identifier: math/cbrt
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L396-L396

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.cbrt()` returns the cube root of x.



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

- [Return the cube root of a value](#return-the-cube-root-of-a-value)
- [Use math.cbrt in map](#use-mathcbrt-in-map)

### Return the cube root of a value

```js
import "math"

math.cbrt(x: 1728.0)// 12.0


```


### Use math.cbrt in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.cbrt(x: r._value)}))

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
| 2021-01-01T00:00:00Z | -1.296638256974172 | t1   |
| 2021-01-01T00:00:10Z | 2.2185755003939347 | t1   |
| 2021-01-01T00:00:20Z | 1.9442962850073848 | t1   |
| 2021-01-01T00:00:30Z | 2.5977297737212623 | t1   |
| 2021-01-01T00:00:40Z | 2.478753275547562  | t1   |
| 2021-01-01T00:00:50Z | 1.6423582966480554 | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 2.7076145363999617  | t2   |
| 2021-01-01T00:00:10Z | 1.7065491319882757  | t2   |
| 2021-01-01T00:00:20Z | -1.5536162529769295 | t2   |
| 2021-01-01T00:00:30Z | 2.703972205402708   | t2   |
| 2021-01-01T00:00:40Z | 2.402081527496116   | t2   |
| 2021-01-01T00:00:50Z | 1.2298089464641     | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
