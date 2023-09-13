---
title: math.erfc() function
description: >
  `math.erfc()` returns the complementary error function of `x`.
menu:
  flux_v0_ref:
    name: math.erfc
    parent: math
    identifier: math/erfc
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L641-L641

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.erfc()` returns the complementary error function of `x`.



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

- [Return the complementary error function of a value](#return-the-complementary-error-function-of-a-value)
- [Use math.erfc in map](#use-matherfc-in-map)

### Return the complementary error function of a value

```js
import "math"

math.erfc(x: 22.6)// 3.772618913849058e-224


```


### Use math.erfc in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.erfc(x: r._value)}))

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

| _time                | _value                                                                                                                                                    | *tag |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 2021-01-01T00:00:00Z | 1.9979506490526588                                                                                                                                        | t1   |
| 2021-01-01T00:00:10Z | 0.000000000000000000000000000000000000000000000000000008381980138107252                                                                                   | t1   |
| 2021-01-01T00:00:20Z | 0.000000000000000000000000262744434287864                                                                                                                 | t1   |
| 2021-01-01T00:00:30Z | 0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011164884065025777 | t1   |
| 2021-01-01T00:00:40Z | 0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006790933091004747                                  | t1   |
| 2021-01-01T00:00:50Z | 0.0000000003729065687554446                                                                                                                               | t1   |

| _time                | _value                                                                                                                                                                                         | *tag |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 2021-01-01T00:00:00Z | 0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002144458719979885 | t2   |
| 2021-01-01T00:00:10Z | 0.0000000000020855419929990413                                                                                                                                                                 | t2   |
| 2021-01-01T00:00:20Z | 1.9999998862727435                                                                                                                                                                             | t2   |
| 2021-01-01T00:00:30Z | 0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005123973574678553  | t2   |
| 2021-01-01T00:00:40Z | 0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000015161509817813512                                                                                        | t2   |
| 2021-01-01T00:00:50Z | 0.008527511664360422                                                                                                                                                                           | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
