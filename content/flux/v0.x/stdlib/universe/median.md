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
  flux_0_x_ref:
    name: median
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, selectors, transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/median/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#median, InfluxQL – MEDIAN()
introduced: 0.7.0
---

The `median()` function is a special application of the [`quantile()` function](/flux/v0.x/stdlib/universe/quantile)
that returns the median `_value` of an input table or all non-null records in the input table
with values that fall within the `0.5` quantile (50th percentile) depending on the [method](#method) used.

_`median()` behaves like an [aggregate function](/flux/v0.x/function-types/#aggregates)
or a [selector function](/flux/v0.x/function-types/#selectors) depending on
the [`method`](#method) used._

```js
median(
    column: "_value",
    method: "estimate_tdigest",
    compression: 0.0,
)
```

When using the `estimate_tdigest` or `exact_mean` methods, it outputs non-null
records with values that fall within the `0.5` quantile.

When using the `exact_selector` method, it outputs the non-null record with the
value that represents the `0.5` quantile.

{{% note %}}
The `median()` function can only be used with float value types.
It is a special application of the [`quantile()` function](/flux/v0.x/stdlib/universe/quantile)
which uses an approximation implementation that requires floats.
You can convert your value column to a float column using the [`toFloat()` function](/flux/v0.x/stdlib/universe/tofloat).
{{% /note %}}

## Parameters

### column {data-type="string"}
Column to use to compute the median.
Default is `"_value"`.

### method {data-type="string"}
Computation method.
Default is `"estimate_tdigest"`.

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

- [Median as an aggregate](#median-as-an-aggregate)
- [Median as a selector](#median-as-a-selector)

#### Median as an aggregate
```js
import "sampledata"

sampledata.float()
    |> median()
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
| t1  |  9.135 |

| tag | _value |
| :-- | -----: |
| t2  |  9.415 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Median as a selector
```js
import "sampledata"

sampledata.float()
    |> median(method: "exact_selector")
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
