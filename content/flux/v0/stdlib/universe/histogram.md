---
title: histogram() function
description: >
  `histogram()` approximates the cumulative distribution of a dataset by counting
  data frequencies for a list of bins.
menu:
  flux_v0_ref:
    name: histogram
    parent: universe
    identifier: universe/histogram
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L812-L822

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`histogram()` approximates the cumulative distribution of a dataset by counting
data frequencies for a list of bins.

A bin is defined by an upper bound where all data points that are less than
or equal to the bound are counted in the bin. Bin counts are cumulative.

Each input table is converted into a single output table representing a single histogram.
Each output table has the same group key as the corresponding input table.
Columns not part of the group key are dropped.
Output tables include additional columns for the upper bound and count of bins.

##### Function type signature

```js
(
    <-tables: stream[A],
    bins: [float],
    ?column: string,
    ?countColumn: string,
    ?normalize: bool,
    ?upperBoundColumn: string,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### column

Column containing input values. Column must be of type float.
Default is `_value`.



### upperBoundColumn

Column to store bin upper bounds in. Default is `le`.



### countColumn

Column to store bin counts in. Default is `_value`.



### bins
({{< req >}})
List of upper bounds to use when computing the histogram frequencies.

Bins should contain a bin whose bound is the maximum value of the data set.
This value can be set to positive infinity if no maximum is known.
#### Bin helper functions
The following helper functions can be used to generated bins.
- linearBins()
- logarithmicBins()

### normalize

Convert counts into frequency values between 0 and 1.
Default is `false`.

**Note**: Normalized histograms cannot be aggregated by summing their counts.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Create a cumulative histogram](#create-a-cumulative-histogram)
- [Create a cumulative histogram with dynamically generated bins](#create-a-cumulative-histogram-with-dynamically-generated-bins)

### Create a cumulative histogram

```js
import "sampledata"

sampledata.float()
    |> histogram(bins: [0.0, 5.0, 10.0, 20.0])

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

{{% /expand %}}
{{< /expand-wrapper >}}

### Create a cumulative histogram with dynamically generated bins

```js
import "sampledata"

sampledata.float()
    |> histogram(bins: linearBins(start: 0.0, width: 4.0, count: 3))

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

| *tag | le   | _value  |
| ---- | ---- | ------- |
| t1   | 0    | 1       |
| t1   | 4    | 1       |
| t1   | 8    | 3       |
| t1   | +Inf | 6       |

| *tag | le   | _value  |
| ---- | ---- | ------- |
| t2   | 0    | 1       |
| t2   | 4    | 2       |
| t2   | 8    | 3       |
| t2   | +Inf | 6       |

{{% /expand %}}
{{< /expand-wrapper >}}
