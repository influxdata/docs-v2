---
title: math.mMin() function
description: >
  `math.mMin()` is a function that returns the lesser of `x` or `y`.
menu:
  flux_v0_ref:
    name: math.mMin
    parent: math
    identifier: math/mMin
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1607-L1607

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.mMin()` is a function that returns the lesser of `x` or `y`.



##### Function type signature

```js
(x: float, y: float) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
x-value to use in the operation.



### y
({{< req >}})
y-value to use in the operation.




## Examples

- [Return the lesser of two values](#return-the-lesser-of-two-values)
- [Use math.mMin in map](#use-mathmmin-in-map)

### Return the lesser of two values

```js
import "math"

math.mMin(x: 1.23, y: 4.56)// 1.23


```


### Use math.mMin in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.mMin(x: r.t1, y: r.t2)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | t1    | t2    |
| -------------------- | ----- | ----- |
| 2021-01-01T00:00:00Z | -2.18 | 19.85 |
| 2021-01-01T00:00:10Z | 10.92 | 4.97  |
| 2021-01-01T00:00:20Z | 7.35  | -3.75 |
| 2021-01-01T00:00:30Z | 17.53 | 19.77 |
| 2021-01-01T00:00:40Z | 15.23 | 13.86 |
| 2021-01-01T00:00:50Z | 4.43  | 1.86  |


#### Output data

| _time                | _value  |
| -------------------- | ------- |
| 2021-01-01T00:00:00Z | -2.18   |
| 2021-01-01T00:00:10Z | 4.97    |
| 2021-01-01T00:00:20Z | -3.75   |
| 2021-01-01T00:00:30Z | 17.53   |
| 2021-01-01T00:00:40Z | 13.86   |
| 2021-01-01T00:00:50Z | 1.86    |

{{% /expand %}}
{{< /expand-wrapper >}}
