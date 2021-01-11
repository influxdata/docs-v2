---
title: median() function
description: >
  The `median()` function returns the median `_value` of an input table or all non-null records
  in the input table with values that fall within the `0.5` quantile or 50th percentile.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/median
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/median/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/median/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/median/
menu:
  influxdb_2_0_ref:
    name: median
    parent: built-in-aggregates
weight: 501
related:
  - /influxdb/v2.0/query-data/flux/median/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#median, InfluxQL – MEDIAN()
introduced: 0.7.0
---

The `median()` function is a special application of the [`quantile()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/quantile)
that returns the median `_value` of an input table or all non-null records in the input table
with values that fall within the `0.5` quantile (50th percentile) depending on the [method](#method) used.

_**Function type:** Selector or Aggregate_  
_**Output data type:** Record_


```js
median(
  column: "_value",
  method: "estimate_tdigest",
  compression: 0.0
)
```

When using the `estimate_tdigest` or `exact_mean` methods, it outputs non-null
records with values that fall within the `0.5` quantile.

When using the `exact_selector` method, it outputs the non-null record with the
value that represents the `0.5` quantile.

{{% note %}}
The `median()` function can only be used with float value types.
It is a special application of the [`quantile()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/quantile)
which uses an approximation implementation that requires floats.
You can convert your value column to a float column using the [`toFloat()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tofloat).
{{% /note %}}

## Parameters

### column
The column to use to compute the median.
Defaults to `"_value"`.

_**Data type:** String_

### method
Defines the method of computation.
Defaults to `"estimate_tdigest"`.

_**Data type:** String_

The available options are:

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.

##### exact_selector
A selector method that returns the data point for which at least `q` points are less than.

### compression
Indicates how many centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Defaults to `1000.0`.

_**Data type:** Float_

## Examples

###### Median as an aggregate
```js
from(bucket: "example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> range(start:-12h)
  |> window(every:10m)
  |> median()
```

###### Median as a selector
```js
from(bucket: "example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> range(start:-12h)
  |> window(every:10m)
  |> median(method: "exact_selector")
```

## Function definition
```js
median = (method="estimate_tdigest", compression=0.0, tables=<-) =>
  quantile(
    q:0.5,
    method:method,
    compression:compression
  )
```
