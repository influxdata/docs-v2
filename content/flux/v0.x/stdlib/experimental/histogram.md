---
title: experimental.histogram() function
description: >
  The `experimental.histogram()` function approximates the cumulative distribution
  of a dataset by counting data frequencies for a list of bins.
menu:
  flux_0_x_ref:
    name: experimental.histogram
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/histogram/
  - /influxdb/cloud/reference/flux/stdlib/experimental/histogram/
related:
  - /influxdb/v2.0/query-data/flux/histograms/
  - /flux/v0.x/stdlib/universe/histogram/
flux/v0.x/tags: [transformations]
introduced: 0.112.0
---

The `experimental.histogram()` function approximates the cumulative distribution
of a dataset by counting data frequencies for a list of bins.
A bin is defined by an upper bound where all data points that are less than or
equal to the bound are counted in the bin.
Bin counts are cumulative.

```js
import "experimental"

experimental.histogram(
    bins: [50.0, 75.0, 90.0],
    normalize: false,
)
```

#### Output schema
`experimental.histogram()` outputs a single table for each input table.
Each output table represents a unique histogram.
Output tables have the same group key as the corresponding input table.

The function does the following:

- Drops columns that are not part of the group key.
- Adds an `le` column to store upper bound values.
- Stores bin counts in the `_value` column.

## Parameters

### bins {data-type="array of floats"}
({{< req >}})
A list of upper bounds to use when computing the histogram frequencies, including the maximum value of the data set.
This value can be set to positive infinity if no maximum is known.

#### Bin helper functions
The following helper functions can be used to generated bins.

[linearBins()](/flux/v0.x/stdlib/universe/linearbins)  
[logarithmicBins()](/flux/v0.x/stdlib/universe/logarithmicbins)

### normalize {data-type="bool"}
Convert count values into frequency values between 0 and 1.
Default is `false`.

{{% note %}}
Normalized histograms cannot be aggregated by summing their counts.
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

#### Histogram with dynamically generated bins
```js
import "experimental"

data
    |> experimental.histogram(bins: linearBins(start: 0.0, width: 20.0, count: 5))
```

##### Input data
{{< flex >}}
{{% flex-content %}}
| _time                | host  | _value |
|:-----                |:----  | ------:|
| 2021-01-01T00:00:00Z | host1 | 33.4   |
| 2021-01-01T00:01:00Z | host1 | 57.2   |
| 2021-01-01T00:02:00Z | host1 | 78.1   |
| 2021-01-01T00:03:00Z | host1 | 79.6   |
{{% /flex-content %}}
{{% flex-content %}}
| _time                | host  | _value |
|:-----                |:----  | ------:|
| 2021-01-01T00:00:00Z | host2 | 10.3   |
| 2021-01-01T00:01:00Z | host2 | 19.8   |
| 2021-01-01T00:02:00Z | host2 | 54.6   |
| 2021-01-01T00:03:00Z | host2 | 56.9   |
{{% /flex-content %}}
{{< /flex >}}

##### Output data
{{< flex >}}
{{% flex-content %}}
| host  | le   | _value |
|:----  | --:  | ------:|
| host1 | 0    | 0      |
| host1 | 20   | 0      |
| host1 | 40   | 1      |
| host1 | 60   | 2      |
| host1 | 80   | 4      |
| host1 | +Inf | 4      |
{{% /flex-content %}}
{{% flex-content %}}
| host  | le   | _value |
|:----  | --:  | ------:|
| host2 | 0    | 0      |
| host2 | 20   | 2      |
| host2 | 40   | 2      |
| host2 | 60   | 4      |
| host2 | 80   | 4      |
| host2 | +Inf | 4      |
{{% /flex-content %}}
{{< /flex >}}
