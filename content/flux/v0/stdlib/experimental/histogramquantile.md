---
title: experimental.histogramQuantile() function
description: >
  `experimental.histogramQuantile()` approximates a quantile given a histogram with the
  cumulative distribution of the dataset.
menu:
  flux_v0_ref:
    name: experimental.histogramQuantile
    parent: experimental
    identifier: experimental/histogramQuantile
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L750-L754

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.histogramQuantile()` approximates a quantile given a histogram with the
cumulative distribution of the dataset.

Each input table represents a single histogram.
Input tables must have two columns: a count column (`_value`) and an upper bound
column (`le`). Neither column can be part of the group key.

The count is the number of values that are less than or equal to the upper bound value (`le`).
Input tables can have an unlimited number of records; each record represents an entry in the histogram.
The counts must be monotonically increasing when sorted by upper bound (`le`).
If any values in the `_value` or `le` columns are `null`, the function returns an error.

Linear interpolation between the two closest bounds is used to compute the quantile.
If the either of the bounds used in interpolation are infinite,
then the other finite bound is used and no interpolation is performed.

The output table has the same group key as the input table.
The function returns the value of the specified quantile from the histogram in the
`_value` column and drops all columns not part of the group key.

##### Function type signature

```js
(
    <-tables: stream[{A with le: float, _value: float}],
    ?minValue: float,
    ?quantile: float,
) => stream[{A with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### quantile

Quantile to compute (`[0.0 - 1.0]`).



### minValue

Assumed minimum value of the dataset. Default is `0.0`.

When the quantile falls below the lowest upper bound, the function
interpolates values between `minValue` and the lowest upper bound.
If `minValue` is equal to negative infinity, the lowest upper bound is used.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Compute the 90th percentile of a histogram

```js
import "experimental"

histogramData
    |> experimental.histogramQuantile(quantile: 0.9)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_field           | _time                | _value  | le    |
| ----------------- | -------------------- | ------- | ----- |
| example_histogram | 2021-01-01T00:00:00Z | 6873    | 0.005 |
| example_histogram | 2021-01-01T00:00:00Z | 9445    | 0.01  |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 0.025 |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 0.05  |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 0.1   |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 0.25  |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 0.5   |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 1     |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 2.5   |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 5     |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | 10    |
| example_histogram | 2021-01-01T00:00:00Z | 9487    | +Inf  |


#### Output data

| *_field           | _value               |
| ----------------- | -------------------- |
| example_histogram | 0.008237363919129085 |

{{% /expand %}}
{{< /expand-wrapper >}}
