---
title: math.ldexp() function
description: >
  `math.ldexp()` is the inverse of `math.frexp()`. It returns `frac x 2**exp`.
menu:
  flux_v0_ref:
    name: math.ldexp
    parent: math
    identifier: math/ldexp
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1309-L1309

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.ldexp()` is the inverse of `math.frexp()`. It returns `frac x 2**exp`.



##### Function type signature

```js
(exp: int, frac: float) => float
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### frac
({{< req >}})
Fraction to use in the operation.



### exp
({{< req >}})
Exponent to use in the operation.




## Examples

- [Return the inverse of math.frexp](#return-the-inverse-of-mathfrexp)
- [Use math.ldexp in map](#use-mathldexp-in-map)

### Return the inverse of math.frexp

```js
import "math"

math.ldexp(frac: 0.5, exp: 6)// 32.0


```


### Use math.ldexp in map

```js
import "math"

data
    |> map(fn: (r) => ({_time: r._time, tag: r.tag, _value: math.ldexp(frac: r.frac, exp: r.exp)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *tag | _time                | exp  | frac      |
| ---- | -------------------- | ---- | --------- |
| t1   | 2021-01-01T00:00:00Z | 2    | -0.545    |
| t1   | 2021-01-01T00:00:10Z | 4    | 0.6825    |
| t1   | 2021-01-01T00:00:20Z | 3    | 0.91875   |
| t1   | 2021-01-01T00:00:30Z | 5    | 0.5478125 |
| t1   | 2021-01-01T00:00:40Z | 4    | 0.951875  |
| t1   | 2021-01-01T00:00:50Z | 3    | 0.55375   |

| *tag | _time                | exp  | frac      |
| ---- | -------------------- | ---- | --------- |
| t2   | 2021-01-01T00:00:00Z | 5    | 0.6203125 |
| t2   | 2021-01-01T00:00:10Z | 3    | 0.62125   |
| t2   | 2021-01-01T00:00:20Z | 2    | -0.9375   |
| t2   | 2021-01-01T00:00:30Z | 5    | 0.6178125 |
| t2   | 2021-01-01T00:00:40Z | 4    | 0.86625   |
| t2   | 2021-01-01T00:00:50Z | 1    | 0.93      |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2.18   | t1   |
| 2021-01-01T00:00:10Z | 10.92   | t1   |
| 2021-01-01T00:00:20Z | 7.35    | t1   |
| 2021-01-01T00:00:30Z | 17.53   | t1   |
| 2021-01-01T00:00:40Z | 15.23   | t1   |
| 2021-01-01T00:00:50Z | 4.43    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19.85   | t2   |
| 2021-01-01T00:00:10Z | 4.97    | t2   |
| 2021-01-01T00:00:20Z | -3.75   | t2   |
| 2021-01-01T00:00:30Z | 19.77   | t2   |
| 2021-01-01T00:00:40Z | 13.86   | t2   |
| 2021-01-01T00:00:50Z | 1.86    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
