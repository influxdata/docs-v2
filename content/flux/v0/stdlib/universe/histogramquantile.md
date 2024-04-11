---
title: histogramQuantile() function
description: >
  `histogramQuantile()` approximates a quantile given a histogram that approximates
  the cumulative distribution of the dataset.
menu:
  flux_v0_ref:
    name: histogramQuantile
    parent: universe
    identifier: universe/histogramQuantile
weight: 101
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L884-L895

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`histogramQuantile()` approximates a quantile given a histogram that approximates
the cumulative distribution of the dataset.

Each input table represents a single histogram.
The histogram tables must have two columns – a count column and an upper bound column.

The count is the number of values that are less than or equal to the upper bound value.
The table can have any number of records, each representing a bin in the histogram.
The counts must be monotonically increasing when sorted by upper bound.
If any values in the count column or upper bound column are _null_, it returns an error.
The count and upper bound columns must **not** be part of the group key.

The quantile is computed using linear interpolation between the two closest bounds.
If either of the bounds used in interpolation are infinite, the other finite
bound is used and no interpolation is performed.

### Output tables
Output tables have the same group key as corresponding input tables.
Columns not part of the group key are dropped.
A single value column of type float is added.
The value column represents the value of the desired quantile from the histogram.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?countColumn: string,
    ?minValue: float,
    ?onNonmonotonic: string,
    ?quantile: float,
    ?upperBoundColumn: string,
    ?valueColumn: string,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### quantile

Quantile to compute. Value must be between 0 and 1.



### countColumn

Column containing histogram bin counts. Default is `_value`.



### upperBoundColumn

Column containing histogram bin upper bounds.
Default is `le`.



### valueColumn

Column to store the computed quantile in. Default is `_value.



### minValue

Assumed minimum value of the dataset. Default is `0.0`.



### onNonmonotonic

Describes behavior when counts are not monotonically increasing
when sorted by upper bound. Default is `error`.

**Supported values**:
- **error**: Produce an error.
- **force**: Force bin counts to be monotonic by adding to each bin such that it
is equal to the next smaller bin.
- **drop**: When a nonmonotonic table is encountered, produce no output.
If the quantile falls below the lowest upper bound, interpolation is
performed between `minValue` and the lowest upper bound.
When `minValue` is equal to negative infinity, the lowest upper bound is used.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Compute the 90th quantile of a histogram

```js
data
    |> histogramQuantile(quantile: 0.9)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *tag | le  | _value  |
| ---- | --- | ------- |
| t1   | 0   | 1       |
| t1   | 5   | 2       |
| t1   | 10  | 3       |
| t1   | 20  | 6       |

| *tag | le  | _value  |
| ---- | --- | ------- |
| t2   | 0   | 1       |
| t2   | 5   | 3       |
| t2   | 10  | 3       |
| t2   | 20  | 6       |


#### Output data

| *tag | _value  |
| ---- | ------- |
| t1   | 18      |

| *tag | _value  |
| ---- | ------- |
| t2   | 18      |

{{% /expand %}}
{{< /expand-wrapper >}}
