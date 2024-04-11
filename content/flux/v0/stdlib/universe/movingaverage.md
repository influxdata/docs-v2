---
title: movingAverage() function
description: >
  `movingAverage()` calculates the mean of non-null values using the current value
  and `n - 1` previous values in the `_values` column.
menu:
  flux_v0_ref:
    name: movingAverage
    parent: universe
    identifier: universe/movingAverage
weight: 101
flux/v0/tags: [transformations]
introduced: 0.35.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1891-L1896

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`movingAverage()` calculates the mean of non-null values using the current value
and `n - 1` previous values in the `_values` column.

### Moving average rules
- The average over a period populated by `n` values is equal to their algebraic mean.
- The average over a period populated by only `null` values is `null`.
- Moving averages skip `null` values.
- If `n` is less than the number of records in a table, `movingAverage()`
  returns the average of the available values.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}], n: int) => stream[{A with _value: float}] where B: Numeric
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of values to average.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate a three point moving average](#calculate-a-three-point-moving-average)
- [Calculate a three point moving average with null values](#calculate-a-three-point-moving-average-with-null-values)

### Calculate a three point moving average

```js
import "sampledata"

sampledata.int()
    |> movingAverage(n: 3)

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

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:20Z | 5                  | t1   |
| 2021-01-01T00:00:30Z | 11.333333333333334 | t1   |
| 2021-01-01T00:00:40Z | 13                 | t1   |
| 2021-01-01T00:00:50Z | 12                 | t1   |

| _time                | _value            | *tag |
| -------------------- | ----------------- | ---- |
| 2021-01-01T00:00:20Z | 6.666666666666667 | t2   |
| 2021-01-01T00:00:30Z | 6.666666666666667 | t2   |
| 2021-01-01T00:00:40Z | 9.666666666666666 | t2   |
| 2021-01-01T00:00:50Z | 11                | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate a three point moving average with null values

```js
import "sampledata"

sampledata.int(includeNull: true)
    |> movingAverage(n: 3)

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
| 2021-01-01T00:00:30Z | 7       | t1   |
| 2021-01-01T00:00:40Z | 7       | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value            | *tag |
| -------------------- | ----------------- | ---- |
| 2021-01-01T00:00:20Z | 0.5               | t2   |
| 2021-01-01T00:00:30Z | 6.666666666666667 | t2   |
| 2021-01-01T00:00:40Z | 8                 | t2   |
| 2021-01-01T00:00:50Z | 10                | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
