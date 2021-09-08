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

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Quantile as an aggregate](#quantile-as-an-aggregate)
- [Quantile as a selector](#quantile-as-a-selector)

#### Quantile as an aggregate
```js
import "sampledata"

sampledata.float()
  |> quantile(
    q: 0.99,
    method: "estimate_tdigest",
    compression: 1000.0
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _value |
| :-- | -----: |
| t1  |  17.53 |

| tag | _value |
| :-- | -----: |
| t2  |  19.85 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Quantile as a selector
```js
import "sampledata"

sampledata.float()
  |> quantile(
    q: 0.5,
    method: "exact_selector"
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t1  | 2021-01-01T00:00:20Z |   7.35 |

| tag | _time                | _value |
| :-- | :------------------- | -----: |
| t2  | 2021-01-01T00:00:10Z |   4.97 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
