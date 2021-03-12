---
title: histogram() function
description: The `histogram()` function approximates the cumulative distribution of a dataset by counting data frequencies for a list of bins.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/histogram
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/histogram/
menu:
  influxdb_2_0_ref:
    name: histogram
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/query-data/flux/histograms/
---

The `histogram()` function approximates the cumulative distribution of a dataset by counting data frequencies for a list of bins.
A bin is defined by an upper bound where all data points that are less than or equal to the bound are counted in the bin.
The bin counts are cumulative.

Each input table is converted into a single output table representing a single histogram.
The output table has the same group key as the input table.
Columns not part of the group key are removed and an upper bound column and a count column are added.

_**Function type:** Transformation_  
_**Output data type:** Record_

```js
histogram(column: "_value", upperBoundColumn: "le", countColumn: "_value", bins: [50.0, 75.0, 90.0], normalize: false)
```

## Parameters

### column
The name of a column containing input data values.
The column type must be float.
Defaults to `"_value"`.

_**Data type:** String_

### upperBoundColumn
The name of the column in which to store the histogram's upper bounds.
Defaults to `"le"`.

_**Data type:** String_

### countColumn
The name of the column in which to store the histogram counts.
Defaults to `"_value"`.

_**Data type:** String_

### bins
A list of upper bounds to use when computing the histogram frequencies.
Bins should contain a bin whose bound is the maximum value of the data set.
This value can be set to positive infinity if no maximum is known.

_**Data type:** Array of floats_

#### Bin helper functions
The following helper functions can be used to generated bins.

[linearBins()](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/linearbins)  
[logarithmicBins()](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/logarithmicbins)

### normalize
When `true`, will convert the counts into frequency values between 0 and 1.
Defaults to `false`.

_**Data type:** Boolean_

{{% note %}}
Normalized histograms cannot be aggregated by summing their counts.
{{% /note %}}

## Examples

##### Histogram with dynamically generated bins
```js
// Dynamically generate 10 bins from 0,10,20,...,100
histogram(
  bins: linearBins(start:0.0, width:10.0, count:10)
)
```
