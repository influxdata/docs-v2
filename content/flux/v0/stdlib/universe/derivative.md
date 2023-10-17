---
title: derivative() function
description: >
  `derivative()` computes the rate of change per unit of time between subsequent
  non-null records.
menu:
  flux_v0_ref:
    name: derivative
    parent: universe
    identifier: universe/derivative
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L276-L286

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`derivative()` computes the rate of change per unit of time between subsequent
non-null records.

The function assumes rows are ordered by the `_time`.

#### Output tables
The output table schema will be the same as the input table.
For each input table with `n` rows, `derivative()` outputs a table with
`n - 1` rows.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?columns: [string],
    ?initialZero: bool,
    ?nonNegative: bool,
    ?timeColumn: string,
    ?unit: duration,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### unit

Time duration used to calculate the derivative. Default is `1s`.



### nonNegative

Disallow negative derivative values. Default is `false`.

When `true`, if a value is less than the previous value, the function
assumes the previous value should have been a zero.

### columns

List of columns to operate on. Default is `["_value"]`.



### timeColumn

Column containing time values to use in the calculation.
Default is `_time`.



### initialZero

Use zero (0) as the initial value in the derivative calculation
when the subsequent value is less than the previous value and `nonNegative` is
`true`. Default is `false`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate the non-negative rate of change per second](#calculate-the-non-negative-rate-of-change-per-second)
- [Calculate the rate of change per second with null values](#calculate-the-rate-of-change-per-second-with-null-values)

### Calculate the non-negative rate of change per second

```js
import "sampledata"

sampledata.int()
    |> derivative(nonNegative: true)

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
| 2021-01-01T00:00:10Z | 1.2     | t1   |
| 2021-01-01T00:00:20Z |         | t1   |
| 2021-01-01T00:00:30Z | 1       | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z |         | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z |         | t2   |
| 2021-01-01T00:00:20Z |         | t2   |
| 2021-01-01T00:00:30Z | 2.2     | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z |         | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the rate of change per second with null values

```js
import "sampledata"

sampledata.int(includeNull: true)
    |> derivative()

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
| 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:20Z | 0.45    | t1   |
| 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:50Z | -0.1    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z |         | t2   |
| 2021-01-01T00:00:20Z | -0.7    | t2   |
| 2021-01-01T00:00:30Z | 2.2     | t2   |
| 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:50Z | -0.9    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
