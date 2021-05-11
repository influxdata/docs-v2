---
title: quantile() function
description: The `quantile()` function outputs non-null records with values that fall within the specified quantile or the non-null record with the value that represents the specified quantile.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/percentile
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/percentile
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/quantile/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/quantile/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/quantile/
menu:
  flux_0_x_ref:
    name: quantile
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, selectors, transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/percentile-quantile/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#percentile, InfluxQL – PERCENTILE()
  - /flux/v0.x/stdlib/experimental/quantile/
introduced: 0.24.0
---

The `quantile()` function returns records from an input table with `_value`s that fall within
a specified quantile or it returns the record with the `_value` that represents the specified quantile.
Which it returns depends on the [method](#method) used.
`quantile()` supports columns with float values.

```js
quantile(
  column: "_value",
  q: 0.99,
  method: "estimate_tdigest",
  compression: 1000.0
)
```

When using the `estimate_tdigest` or `exact_mean` methods, it outputs non-null
records with values that fall within the specified quantile.

When using the `exact_selector` method, it outputs the non-null record with the
value that represents the specified quantile.

## Parameters

### column {data-type="string"}
Column to use to compute the quantile.
Default is `"_value"`.

### q {data-type="float"}
({{< req >}})
Value between 0 and 1 indicating the desired quantile.

### method {data-type="string"}
Computation method.
Default is `estimate_tdigest`.

The available options are:

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.

##### exact_selector
A selector method that returns the data point for which at least `q` points are less than.

### compression {data-type="float"}
Number of centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Default is `1000.0`.

## Examples

###### Quantile as an aggregate
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system")
	|> quantile(
    q: 0.99,
    method: "estimate_tdigest",
    compression: 1000.0
  )
```

###### Quantile as a selector
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system")
	|> quantile(
    q: 0.99,
    method: "exact_selector"
  )
```
