---
title: experimental.quantile() function
description: >
  The `experimental.quantile()` function outputs non-null records with values in
  the `_value` column that fall within the specified quantile or the non-null
  record with the value in the `_value` column that represents the specified quantile.
menu:
  influxdb_2_0_ref:
    name: experimental.quantile
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/query-data/flux/percentile-quantile/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/quantile/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#percentile, InfluxQL – PERCENTILE()
---

The `experimental.quantile()` function outputs non-null records with values in
the `_value` column that fall within the specified quantile or represent the specified quantile.
Which it returns depends on the [method](#method) used.
The `_value` column must contain float values.

_**Function type:** Aggregate or Selector_  

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

### q
A value between 0 and 1 thats specifies the quantile.

_**Data type:** Float_

### method
Computation method.
Default is `estimate_tdigest`.

_**Data type:** String_

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

### compression
Indicates how many centroids to use when compressing the dataset.
A larger number produces a more accurate result at the cost of increased memory requirements.
Defaults to `1000.0`.

_**Data type:** Float_

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
