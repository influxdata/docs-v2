---
title: histogramQuantile() function
description: >
 The `histogramQuantile()` function approximates a quantile given a histogram
 that approximates the cumulative distribution of the dataset.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/histogramquantile
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/histogramquantile/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/histogramquantile/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/histogramquantile/
menu:
  flux_0_x_ref:
    name: histogramQuantile
    parent: universe
weight: 102
related:
  - /flux/v0.x/stdlib/experimental/histogramquantile/
flux/v0.x/tags: [aggregates, transformations]
introduced: 0.7.0
---

The `histogramQuantile()` function approximates a quantile given a histogram that
approximates the cumulative distribution of the dataset.
Each input table represents a single histogram.
The histogram tables must have two columns – a count column and an upper bound column.

The count is the number of values that are less than or equal to the upper bound value.
The table can have any number of records, each representing an entry in the histogram.
The counts must be monotonically increasing when sorted by upper bound.
If any values in the count column or upper bound column are `null`, it returns an error.

Linear interpolation between the two closest bounds is used to compute the quantile.
If the either of the bounds used in interpolation are infinite,
then the other finite bound is used and no interpolation is performed.

The output table has the same group key as the input table.
Columns not part of the group key are removed and a single value column of type float is added.
The count and upper bound columns must not be part of the group key.
The value column represents the value of the desired quantile from the histogram.

_**Output data type:** Float_

```js
histogramQuantile(
  quantile: 0.5,
  countColumn: "_value",
  upperBoundColumn: "le",
  valueColumn: "_value",
  minValue: 0.0
)
```

_`histogramQuantile()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

## Parameters

### quantile {data-type="float"}
({{< req >}})
A value between 0 and 1 indicating the desired quantile to compute.

### countColumn {data-type="string"}
The name of the column containing the histogram counts.
The count column type must be float.
Default is `"_value"`.

### upperBoundColumn {data-type="string"}
The name of the column containing the histogram upper bounds.
The upper bound column type must be float.
Default is `"le"`.

### valueColumn {data-type="string"}
The name of the output column which will contain the computed quantile.
Default is `"_value"`.

### minValue {data-type="float"}
The assumed minimum value of the dataset.
When the quantile falls below the lowest upper bound, interpolation is performed between `minValue` and the lowest upper bound.
When `minValue` is equal to negative infinity, the lowest upper bound is used.
Default is `0.0`.

{{% note %}}
When the quantile falls below the lowest upper bound,
interpolation is performed between `minValue` and the lowest upper bound.
When `minValue` is equal to negative infinity, the lowest upper bound is used.
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Compute the 90th quantile of a histogram
```js
import "sampledata"

data = sampledata.float()
  |> histogram(bins: [0.0, 5.0, 10.0, 20.0])

data
  |> histogramQuantile(quantile: 0.9)
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
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
{{% flex-content %}}

##### Output data
| tag | _value |
| :-- | -----: |
| t1  |   18.0 |

| tag | _value |
| :-- | -----: |
| t2  |   18.0 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
