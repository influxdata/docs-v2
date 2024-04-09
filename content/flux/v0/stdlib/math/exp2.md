---
title: math.exp2() function
description: >
  `math.exp2()` returns `2**x`, the base-2 exponential of `x`.
menu:
  flux_v0_ref:
    name: math.exp2
    parent: math
    identifier: math/exp2
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L789-L789

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.exp2()` returns `2**x`, the base-2 exponential of `x`.



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

- [Return the base-2 exponential of a value](#return-the-base-2-exponential-of-a-value)
- [Use math.exp2 in map](#use-mathexp2-in-map)

### Return the base-2 exponential of a value

```js
import "math"

math.exp2(x: 21.0)// 2.097152e+06


```


### Use math.exp2 in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.exp2(x: r._value)}))

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
| 2021-01-01T00:00:00Z | 0.22067574907266369 | t1   |
| 2021-01-01T00:00:10Z | 1937.5260604940204  | t1   |
| 2021-01-01T00:00:20Z | 163.1437602968655   | t1   |
| 2021-01-01T00:00:30Z | 189258.68751552477  | t1   |
| 2021-01-01T00:00:40Z | 38431.45561643022   | t1   |
| 2021-01-01T00:00:50Z | 21.55573722985104   | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 945029.6050826148   | t2   |
| 2021-01-01T00:00:10Z | 31.341449522781655  | t2   |
| 2021-01-01T00:00:20Z | 0.07432544468767006 | t2   |
| 2021-01-01T00:00:30Z | 894052.4842704767   | t2   |
| 2021-01-01T00:00:40Z | 14868.793840716358  | t2   |
| 2021-01-01T00:00:50Z | 3.6300766212686435  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
