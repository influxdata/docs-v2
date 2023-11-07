---
title: exponentialMovingAverage() function
description: >
  `exponentialMovingAverage()` calculates the exponential moving average of `n`
  number of values in the `_value` column giving more weight to more recent data.
menu:
  flux_v0_ref:
    name: exponentialMovingAverage
    parent: universe
    identifier: universe/exponentialMovingAverage
weight: 101
flux/v0/tags: [transformations]
introduced: 0.37.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L574-L579

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`exponentialMovingAverage()` calculates the exponential moving average of `n`
number of values in the `_value` column giving more weight to more recent data.

### Exponential moving average rules

- The first value of an exponential moving average over `n` values is the algebraic mean of `n` values.
- Subsequent values are calculated as `y(t) = x(t) * k + y(t-1) * (1 - k)`, where:
    - `y(t)` is the exponential moving average at time `t`.
    - `x(t)` is the value at time `t`.
    - `k = 2 / (1 + n)`.
- The average over a period populated by only `null` values is `null`.
- Exponential moving averages skip `null` values.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}], n: int) => stream[{A with _value: B}] where B: Numeric
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of values to average.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate a three point exponential moving average](#calculate-a-three-point-exponential-moving-average)
- [Calculate a three point exponential moving average with null values](#calculate-a-three-point-exponential-moving-average-with-null-values)

### Calculate a three point exponential moving average

```js
import "sampledata"

sampledata.int()
    |> exponentialMovingAverage(n: 3)

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 5       | t1   |
| 2021-01-01T00:00:30Z | 11      | t1   |
| 2021-01-01T00:00:40Z | 13      | t1   |
| 2021-01-01T00:00:50Z | 8.5     | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:20Z | 6.666666666666667  | t2   |
| 2021-01-01T00:00:30Z | 12.833333333333334 | t2   |
| 2021-01-01T00:00:40Z | 12.916666666666668 | t2   |
| 2021-01-01T00:00:50Z | 6.958333333333334  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate a three point exponential moving average with null values

```js
import "sampledata"

sampledata.int(includeNull: true)
    |> exponentialMovingAverage(n: 3)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 2.5     | t1   |
| 2021-01-01T00:00:30Z | 2.5     | t1   |
| 2021-01-01T00:00:40Z | 2.5     | t1   |
| 2021-01-01T00:00:50Z | 3.25    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 0.5     | t2   |
| 2021-01-01T00:00:30Z | 9.75    | t2   |
| 2021-01-01T00:00:40Z | 9.75    | t2   |
| 2021-01-01T00:00:50Z | 5.375   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
