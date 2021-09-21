---
title: histogram() function
description: The `histogram()` function approximates the cumulative distribution of a dataset by counting data frequencies for a list of bins.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/histogram
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/histogram/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/histogram/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/histogram/
menu:
  flux_0_x_ref:
    name: histogram
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/histograms/
introduced: 0.7.0
---

The `histogram()` function approximates the cumulative distribution of a dataset by counting data frequencies for a list of bins.
A bin is defined by an upper bound where all data points that are less than or equal to the bound are counted in the bin.
The bin counts are cumulative.

Each input table is converted into a single output table representing a single histogram.
The output table has the same group key as the input table.
Columns not part of the group key are removed and an upper bound column and a count column are added.

```js
histogram(
  column: "_value",
  upperBoundColumn: "le",
  countColumn: "_value",
  bins: [50.0, 75.0, 90.0],
  normalize: false
  )
```

## Parameters

### column {data-type="string"}
The name of a column containing input data values.
The column type must be float.
Default is `"_value"`.

### upperBoundColumn {data-type="string"}
The name of the column in which to store the histogram's upper bounds.
Default is `"le"`.

### countColumn {data-type="string"}
The name of the column in which to store the histogram counts.
Default is `"_value"`.

### bins {data-type="array of floats"}
({{< req >}}) A list of upper bounds to use when computing the histogram frequencies.
Bins should contain a bin whose bound is the maximum value of the data set.
This value can be set to positive infinity if no maximum is known.

#### Bin helper functions
The following helper functions can be used to generated bins.

[linearBins()](/flux/v0.x/stdlib/universe/linearbins)  
[logarithmicBins()](/flux/v0.x/stdlib/universe/logarithmicbins)

### normalize {data-type="bool"}
When `true`, will convert the counts into frequency values between 0 and 1.
Default is `false`.

{{% note %}}
Normalized histograms cannot be aggregated by summing their counts.
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Create a cumulative histogram](#create-a-cumulative-histogram)
- [Create a cumulative histogram with dynamically generated bins](#create-a-cumulative-histogram-with-dynamically-generated-bins)

#### Create a cumulative histogram
```js
import "sampledata"

sampledata.float()
  |> histogram(bins: [0.0, 5.0, 10.0, 20.0])
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag |   le | _value |
| :-- | ---: | -----: |
| t1  |  0.0 |    1.0 |
| t1  |  5.0 |    2.0 |
| t1  | 10.0 |    3.0 |
| t1  | 20.0 |    6.0 |

| tag |   le | _value |
| :-- | ---: | -----: |
| t2  |  0.0 |    1.0 |
| t2  |  5.0 |    3.0 |
| t2  | 10.0 |    3.0 |
| t2  | 20.0 |    6.0 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Create a cumulative histogram with dynamically generated bins
```js
import "sampledata"

sampledata.float()
  |> histogram(
    bins: linearBins(start:0.0, width:4.0, count:3)
  )
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag |   le | _value |
| :-- | ---: | -----: |
| t1  |  0.0 |    1.0 |
| t1  |  4.0 |    1.0 |
| t1  |  8.0 |    3.0 |
| t1  | +Inf |    6.0 |

| tag |   le | _value |
| :-- | ---: | -----: |
| t2  |  0.0 |    1.0 |
| t2  |  4.0 |    2.0 |
| t2  |  8.0 |    3.0 |
| t2  | +Inf |    6.0 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
