---
title: experimental.quantile() function
description: >
  The `experimental.quantile()` function outputs non-null records with values in
  the `_value` column that fall within the specified quantile or the non-null
  record with the value in the `_value` column that represents the specified quantile.
menu:
  flux_0_x_ref:
    name: experimental.quantile
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/quantile/
  - /influxdb/cloud/reference/flux/stdlib/experimental/quantile/
related:
  - /influxdb/v2.0/query-data/flux/percentile-quantile/
  - /flux/v0.x/stdlib/universe/quantile/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#percentile, InfluxQL – PERCENTILE()
flux/v0.x/tags: [transformations, aggregates, selectors]
introduced: 0.107.0
---

The `experimental.quantile()` function outputs non-null records with values in
the `_value` column that fall within the specified quantile or represent the specified quantile.
Which it returns depends on the [method](#method) used.
The `_value` column must contain float values.

_`experimental.quantile()` behaves like an [aggregate function](/flux/v0.x/function-types/#aggregates)
or a [selector function](/flux/v0.x/function-types/#selectors) depending on
the [`method`](#method) used._

```js
import "experimental"

experimental.quantile(
  q: 0.99,
  method: "estimate_tdigest",
  compression: 1000.0
)
```

When using the `estimate_tdigest` or `exact_mean` methods, the function outputs
non-null records with values that fall within the specified quantile.

When using the `exact_selector` method, it outputs the non-null record with the
value that represents the specified quantile.

## Parameters

### q {data-type="float"}
A value between 0 and 1 thats specifies the quantile.

### method {data-type="string"}
Computation method.
Default is `estimate_tdigest`.

**Available options:**

- [estimate_tdigest](#estimate_tdigest)
- [exact_mean](#exact_mean)
- [exact_selector](#exact_selector)

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.

##### exact_selector
A selector method that returns the data point for which at least `q` points are less than.

### compression {data-type="float"}
Indicates how many centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Defaults to `1000.0`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

###### Quantile as an aggregate
```js
import "experimental"

from(bucket: "example-bucket")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field")
	|> experimental.quantile(
    q: 0.99,
    method: "estimate_tdigest",
    compression: 1000.0
  )
```

###### Quantile as a selector
```js
import "experimental"

from(bucket: "example-bucket")
	|> range(start: -5m)
	|> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field")
	|> experimental.quantile(
    q: 0.99,
    method: "exact_selector"
  )
```
