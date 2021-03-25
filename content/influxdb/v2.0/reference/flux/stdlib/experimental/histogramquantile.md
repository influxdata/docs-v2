---
title: experimental.histogramQuantile() function
description: >
 The `experimental.histogramQuantile()` function approximates a quantile given a
 histogram with the cumulative distribution of the dataset.
menu:
  influxdb_2_0_ref:
    name: experimental.histogramQuantile
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/histogramquantile/
---

The `experimental.histogramQuantile()` function approximates a quantile given a
histogram with the cumulative distribution of the dataset.
Each input table represents a single histogram.
Each input table represents a single histogram. Input tables must have two columns—a count column (`_value`) and an upper bound column (`le`), and neither column can be part of the group key. 

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

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
import "experimental"

experimental.histogramQuantile(
  quantile: 0.5,
  minValue: 0.0
)
```

## Parameters

### quantile
A value between 0 and 1 indicating the desired quantile to compute.

_**Data type:** Float_

### minValue
The assumed minimum value of the dataset.
When the quantile falls below the lowest upper bound, interpolation is performed between `minValue` and the lowest upper bound.
When `minValue` is equal to negative infinity, the lowest upper bound is used.
Defaults to `0.0`.

_**Data type:** Float_

{{% note %}}
When the quantile falls below the lowest upper bound (`le`),
interpolation is performed between `minValue` and the lowest upper bound.
When `minValue` is equal to negative infinity, the lowest upper bound is used.
{{% /note %}}

## Examples

##### Compute the 90th quantile
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -1d)
  |> filter(fn: (r) =>
    r._meausrement == "example-measurement" and
    r._field == "example-field"
  )
  |> experimental.histogramQuantile(quantile: 0.9)
```
