---
title: experimental.quantile() function
description: >
  `experimental.quantile()` returns non-null records with values in the `_value` column that
  fall within the specified quantile or represent the specified quantile.
menu:
  flux_v0_ref:
    name: experimental.quantile
    parent: experimental
    identifier: experimental/quantile
weight: 101
flux/v0.x/tags: [transformations, aggregates, selectors]
introduced: 0.107.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L884-L889

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.quantile()` returns non-null records with values in the `_value` column that
fall within the specified quantile or represent the specified quantile.

The `_value` column must contain float values.

## Computation methods and behavior
`experimental.quantile()` behaves like an **aggregate function** or a
**selector function** depending on the `method` parameter.
The following computation methods are available:

##### estimate_tdigest
An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.
When used, `experimental.quantile()` outputs non-null records with values
that fall within the specified quantile.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.
When used, `experimental.quantile()` outputs non-null records with values
that fall within the specified quantile.

##### exact_selector
A selector method that returns the data point for which at least `q` points are less than.
When used, `experimental.quantile()` outputs the non-null record with the
value that represents the specified quantile.

##### Function type signature

```js
(
    <-tables: stream[{A with _value: float}],
    q: float,
    ?compression: float,
    ?method: string,
) => stream[{A with _value: float}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### q
({{< req >}})
Quantile to compute (`[0 - 1]`).



### method

Computation method. Default is `estimate_tdigest`.

**Supported methods**:
- estimate_tdigest
- exact_mean
- exact_selector

### compression

Number of centroids to use when compressing the dataset.
Default is `1000.0`.

A larger number produces a more accurate result at the cost of increased
memory requirements.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Return values in the 50th percentile of each input table](#return-values-in-the-50th-percentile-of-each-input-table)
- [Return a value representing the 50th percentile of each input table](#return-a-value-representing-the-50th-percentile-of-each-input-table)

### Return values in the 50th percentile of each input table

```js
import "experimental"
import "sampledata"

sampledata.float()
    |> experimental.quantile(q: 0.5)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| *tag | _value  |
| ---- | ------- |
| t1   | 9.135   |

| *tag | _value  |
| ---- | ------- |
| t2   | 9.415   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Return a value representing the 50th percentile of each input table

```js
import "experimental"
import "sampledata"

sampledata.float()
    |> experimental.quantile(q: 0.5, method: "exact_selector")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:20Z | t1   | 7.35    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:10Z | t2   | 4.97    |

{{% /expand %}}
{{< /expand-wrapper >}}
