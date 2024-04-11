---
title: math.erfcinv() function
description: >
  `math.erfcinv()` returns the inverse of `math.erfc()`.
menu:
  flux_v0_ref:
    name: math.erfcinv
    parent: math
    identifier: math/erfcinv
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L682-L682

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.erfcinv()` returns the inverse of `math.erfc()`.



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

`x` should be greater than 0 and less than 2. Otherwise the operation
will return `NaN`.


## Examples

- [Return the inverse complimentary error function](#return-the-inverse-complimentary-error-function)
- [Use math.erfcinv in map](#use-matherfcinv-in-map)

### Return the inverse complimentary error function

```js
import "math"

math.erfcinv(x: 0.42345)// 0.5660037715858239


```


### Use math.erfcinv in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.erfcinv(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

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


#### Output data

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | -2.1800000000000006 | t1   |
| 2021-01-01T00:00:10Z | +Inf                | t1   |
| 2021-01-01T00:00:20Z | +Inf                | t1   |
| 2021-01-01T00:00:30Z | +Inf                | t1   |
| 2021-01-01T00:00:40Z | +Inf                | t1   |
| 2021-01-01T00:00:50Z | 4.429999992395194   | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | +Inf                | t2   |
| 2021-01-01T00:00:10Z | 4.969999434158999   | t2   |
| 2021-01-01T00:00:20Z | -3.7500000000779927 | t2   |
| 2021-01-01T00:00:30Z | +Inf                | t2   |
| 2021-01-01T00:00:40Z | +Inf                | t2   |
| 2021-01-01T00:00:50Z | 1.860000000000001   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
