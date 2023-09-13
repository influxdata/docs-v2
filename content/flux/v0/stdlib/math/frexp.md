---
title: math.frexp() function
description: >
  `math.frexp()` breaks `f` into a normalized fraction and an integral part of two.
menu:
  flux_v0_ref:
    name: math.frexp
    parent: math
    identifier: math/frexp
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L957-L957

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.frexp()` breaks `f` into a normalized fraction and an integral part of two.

It returns **frac** and **exp** satisfying `f == frac x 2**exp`,
with the absolute value of **frac** in the interval [1/2, 1).

##### Function type signature

```js
(f: float) => {frac: float, exp: int}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### f
({{< req >}})
Value to operate on.




## Examples

- [Return the normalize fraction and integral of a value](#return-the-normalize-fraction-and-integral-of-a-value)
- [Use math.frexp in map](#use-mathfrexp-in-map)

### Return the normalize fraction and integral of a value

```js
import "math"

math.frexp(f: 22.0)// {exp: 5, frac: 0.6875}


```


### Use math.frexp in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(
        fn: (r) => {
            result = math.frexp(f: r._value)

            return {r with exp: result.exp, frac: result.frac}
        },
    )

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

| _time                | _value  | exp  | frac      | *tag |
| -------------------- | ------- | ---- | --------- | ---- |
| 2021-01-01T00:00:00Z | -2.18   | 2    | -0.545    | t1   |
| 2021-01-01T00:00:10Z | 10.92   | 4    | 0.6825    | t1   |
| 2021-01-01T00:00:20Z | 7.35    | 3    | 0.91875   | t1   |
| 2021-01-01T00:00:30Z | 17.53   | 5    | 0.5478125 | t1   |
| 2021-01-01T00:00:40Z | 15.23   | 4    | 0.951875  | t1   |
| 2021-01-01T00:00:50Z | 4.43    | 3    | 0.55375   | t1   |

| _time                | _value  | exp  | frac      | *tag |
| -------------------- | ------- | ---- | --------- | ---- |
| 2021-01-01T00:00:00Z | 19.85   | 5    | 0.6203125 | t2   |
| 2021-01-01T00:00:10Z | 4.97    | 3    | 0.62125   | t2   |
| 2021-01-01T00:00:20Z | -3.75   | 2    | -0.9375   | t2   |
| 2021-01-01T00:00:30Z | 19.77   | 5    | 0.6178125 | t2   |
| 2021-01-01T00:00:40Z | 13.86   | 4    | 0.86625   | t2   |
| 2021-01-01T00:00:50Z | 1.86    | 1    | 0.93      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
