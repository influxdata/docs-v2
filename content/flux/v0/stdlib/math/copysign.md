---
title: math.copysign() function
description: >
  `math.copysign()` returns a value with the magnitude `x` and the sign of `y`.
menu:
  flux_v0_ref:
    name: math.copysign
    parent: math
    identifier: math/copysign
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L465-L465

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.copysign()` returns a value with the magnitude `x` and the sign of `y`.



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
Magnitude to use in the operation.



### y
({{< req >}})
Sign to use in the operation.




## Examples

- [Return the copysign of two columns](#return-the-copysign-of-two-columns)
- [Use math.copysign in map](#use-mathcopysign-in-map)

### Return the copysign of two columns

```js
import "math"

math.copysign(x: 1.0, y: 2.0)

```


### Use math.copysign in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, _value: math.copysign(x: r.x, y: r.y)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | x   | y    |
| -------------------- | --- | ---- |
| 2021-01-01T00:00:00Z | 1.2 | 3.9  |
| 2021-01-01T01:00:00Z | 2.4 | -4.2 |
| 2021-01-01T02:00:00Z | 3.6 | 5.3  |
| 2021-01-01T03:00:00Z | 4.8 | -6.8 |
| 2021-01-01T04:00:00Z | 5.1 | 7.5  |


#### Output data

| _time                | _value |
| -------------------- | ------ |
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T01:00:00Z | -2.4   |
| 2021-01-01T02:00:00Z | 3.6    |
| 2021-01-01T03:00:00Z | -4.8   |
| 2021-01-01T04:00:00Z | 5.1    |

{{% /expand %}}
{{< /expand-wrapper >}}
