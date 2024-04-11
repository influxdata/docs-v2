---
title: experimental.histogram() function
description: >
  `experimental.histogram()` approximates the cumulative distribution of a dataset by counting
  data frequencies for a list of bins.
menu:
  flux_v0_ref:
    name: experimental.histogram
    parent: experimental
    identifier: experimental/histogram
weight: 101
flux/v0/tags: [transformations]
introduced: 0.112.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1276-L1280

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.histogram()` approximates the cumulative distribution of a dataset by counting
data frequencies for a list of bins.

A bin is defined by an upper bound where all data points that are less than
or equal to the bound are counted in the bin.
Bin counts are cumulative.

#### Function behavior
- Outputs a single table for each input table.
- Each output table represents a unique histogram.
- Output tables have the same group key as the corresponding input table.
- Drops columns that are not part of the group key.
- Adds an `le` column to store upper bound values.
- Stores bin counts in the `_value` column.

##### Function type signature

```js
(<-tables: stream[{A with _value: float}], bins: [float], ?normalize: bool) => stream[{A with le: float, _value: float}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bins
({{< req >}})
List of upper bounds to use when computing histogram frequencies,
including the maximum value of the data set.

This value can be set to positive infinity (`float(v: "+Inf")`) if no maximum is known.
##### Bin helper functions
The following helper functions can be used to generated bins.
- `linearBins()`
- `logarithmicBins()`

### normalize

Convert count values into frequency values between 0 and 1.
Default is `false`.

**Note**: Normalized histograms cannot be aggregated by summing their counts.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Create a histogram from input data

```js
import "experimental"
import "sampledata"

sampledata.float()
    |> experimental.histogram(
        bins: [
            0.0,
            5.0,
            10.0,
            15.0,
            20.0,
        ],
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

| *tag | le  | _value  |
| ---- | --- | ------- |
| t1   | 0   | 1       |
| t1   | 5   | 2       |
| t1   | 10  | 3       |
| t1   | 15  | 4       |
| t1   | 20  | 6       |

| *tag | le  | _value  |
| ---- | --- | ------- |
| t2   | 0   | 1       |
| t2   | 5   | 3       |
| t2   | 10  | 3       |
| t2   | 15  | 4       |
| t2   | 20  | 6       |

{{% /expand %}}
{{< /expand-wrapper >}}
