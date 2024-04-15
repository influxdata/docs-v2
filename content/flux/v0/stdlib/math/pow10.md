---
title: math.pow10() function
description: >
  `math.pow10()` returns 10**n, the base-10 exponential of `n`.
menu:
  flux_v0_ref:
    name: math.pow10
    parent: math
    identifier: math/pow10
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1828-L1828

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.pow10()` returns 10**n, the base-10 exponential of `n`.



##### Function type signature

```js
(n: int) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Exponent value.




## Examples

- [Return the base-10 exponential of n](#return-the-base-10-exponential-of-n)
- [Use math.pow10 in map](#use-mathpow10-in-map)

### Return the base-10 exponential of n

```js
import "math"

math.pow10(n: 3)// 1000.0


```


### Use math.pow10 in map

```js
import "math"
import "sampledata"

sampledata.int()
    |> map(fn: (r) => ({r with _value: math.pow10(n: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 0.01               | t1   |
| 2021-01-01T00:00:10Z | 10000000000        | t1   |
| 2021-01-01T00:00:20Z | 10000000           | t1   |
| 2021-01-01T00:00:30Z | 100000000000000000 | t1   |
| 2021-01-01T00:00:40Z | 1000000000000000   | t1   |
| 2021-01-01T00:00:50Z | 10000              | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 10000000000000000000 | t2   |
| 2021-01-01T00:00:10Z | 10000                | t2   |
| 2021-01-01T00:00:20Z | 0.001                | t2   |
| 2021-01-01T00:00:30Z | 10000000000000000000 | t2   |
| 2021-01-01T00:00:40Z | 10000000000000       | t2   |
| 2021-01-01T00:00:50Z | 10                   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
