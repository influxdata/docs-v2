---
title: math.nextafter() function
description: >
  `math.nextafter()` returns the next representable float value after `x` towards `y`.
menu:
  flux_v0_ref:
    name: math.nextafter
    parent: math
    identifier: math/nextafter
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1741-L1741

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.nextafter()` returns the next representable float value after `x` towards `y`.



##### Function type signature

```js
(x: float, y: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### x
({{< req >}})
x-value to use in the operation.



### y
({{< req >}})
y-value to use in the operation.




## Examples

- [Return the next possible float value](#return-the-next-possible-float-value)
- [Use math.nextafter in map](#use-mathnextafter-in-map)

### Return the next possible float value

```js
import "math"

math.nextafter(x: 1.23, y: 4.56)// 1.2300000000000002


```


### Use math.nextafter in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.nextafter(x: r.t1, y: r.t2)}))

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

| _time                | _value              |
| -------------------- | ------------------- |
| 2021-01-01T00:00:00Z | -2.1799999999999997 |
| 2021-01-01T00:00:10Z | 10.919999999999998  |
| 2021-01-01T00:00:20Z | 7.349999999999999   |
| 2021-01-01T00:00:30Z | 17.530000000000005  |
| 2021-01-01T00:00:40Z | 15.229999999999999  |
| 2021-01-01T00:00:50Z | 4.429999999999999   |

{{% /expand %}}
{{< /expand-wrapper >}}
