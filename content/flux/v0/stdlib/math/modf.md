---
title: math.modf() function
description: >
  `math.modf()` returns integer and fractional floating-point numbers that sum to `f`.
menu:
  flux_v0_ref:
    name: math.modf
    parent: math
    identifier: math/modf
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1691-L1691

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.modf()` returns integer and fractional floating-point numbers that sum to `f`.

Both values have the same sign as `f`.

##### Function type signature

```js
(f: float) => {int: float, frac: float}
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### f
({{< req >}})
Value to operate on.




## Examples

- [Return the integer and float that sum to a value](#return-the-integer-and-float-that-sum-to-a-value)
- [Use math.modf in map](#use-mathmodf-in-map)

### Return the integer and float that sum to a value

```js
import "math"

math.modf(f: 3.14)// {frac: 0.14000000000000012, int: 3}


```


### Use math.modf in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(
        fn: (r) => {
            result = math.modf(f: r._value)

            return {_time: r._time, int: result.int, frac: result.frac}
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

| _time                | frac                 | int  |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | -0.18000000000000016 | -2   |
| 2021-01-01T00:00:10Z | 0.9199999999999999   | 10   |
| 2021-01-01T00:00:20Z | 0.34999999999999964  | 7    |
| 2021-01-01T00:00:30Z | 0.5300000000000011   | 17   |
| 2021-01-01T00:00:40Z | 0.23000000000000043  | 15   |
| 2021-01-01T00:00:50Z | 0.4299999999999997   | 4    |
| 2021-01-01T00:00:00Z | 0.8500000000000014   | 19   |
| 2021-01-01T00:00:10Z | 0.9699999999999998   | 4    |
| 2021-01-01T00:00:20Z | -0.75                | -3   |
| 2021-01-01T00:00:30Z | 0.7699999999999996   | 19   |
| 2021-01-01T00:00:40Z | 0.8599999999999994   | 13   |
| 2021-01-01T00:00:50Z | 0.8600000000000001   | 1    |

{{% /expand %}}
{{< /expand-wrapper >}}
