---
title: math.lgamma() function
description: >
  `math.lgamma()` returns the natural logarithm and sign (-1 or +1) of `math.gamma(x:x)`.
menu:
  flux_v0_ref:
    name: math.lgamma
    parent: math
    identifier: math/lgamma
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1350-L1350

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.lgamma()` returns the natural logarithm and sign (-1 or +1) of `math.gamma(x:x)`.



##### Function type signature

```js
(x: float) => {sign: int, lgamma: float}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Return the natural logarithm and sign of a gamma function](#return-the-natural-logarithm-and-sign-of-a-gamma-function)
- [Use math.lgamma in map](#use-mathlgamma-in-map)

### Return the natural logarithm and sign of a gamma function

```js
import "math"

math.lgamma(x: 3.14)// {lgamma: 0.8261387047770286, sign: 1}


```


### Use math.lgamma in map

```js
import "sampledata"
import "math"

sampledata.float()
    |> map(
        fn: (r) => {
            result = math.lgamma(x: r._value)

            return {r with lgamma: result.lgamma, sign: result.sign}
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

| _time                | _value  | lgamma             | sign  | *tag |
| -------------------- | ------- | ------------------ | ----- | ---- |
| 2021-01-01T00:00:00Z | -2.18   | 0.9031727084064437 | -1    | t1   |
| 2021-01-01T00:00:10Z | 10.92   | 14.916577673425685 | 1     | t1   |
| 2021-01-01T00:00:20Z | 7.35    | 7.243966588004043  | 1     | t1   |
| 2021-01-01T00:00:30Z | 17.53   | 32.16614206633506  | 1     | t1   |
| 2021-01-01T00:00:40Z | 15.23   | 25.808134773211734 | 1     | t1   |
| 2021-01-01T00:00:50Z | 4.43    | 2.3571285321490905 | 1     | t1   |

| _time                | _value  | lgamma                | sign  | *tag |
| -------------------- | ------- | --------------------- | ----- | ---- |
| 2021-01-01T00:00:00Z | 19.85   | 38.8948838691485      | 1     | t2   |
| 2021-01-01T00:00:10Z | 4.97    | 3.132970115904918     | 1     | t2   |
| 2021-01-01T00:00:20Z | -3.75   | -1.3172679424463634   | 1     | t2   |
| 2021-01-01T00:00:30Z | 19.77   | 38.65802514327764     | 1     | t2   |
| 2021-01-01T00:00:40Z | 13.86   | 22.188483434123324    | 1     | t2   |
| 2021-01-01T00:00:50Z | 1.86    | -0.052676311706898016 | 1     | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
