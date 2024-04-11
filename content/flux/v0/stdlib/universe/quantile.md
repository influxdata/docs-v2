---
title: quantile() function
description: >
  `quantile()` returns rows from each input table with values that fall within a
  specified quantile or returns the row with the value that represents the
  specified quantile.
menu:
  flux_v0_ref:
    name: quantile
    parent: universe
    identifier: universe/quantile
weight: 101
flux/v0/tags: [transformations, aggregates, selectors]
introduced: 0.24.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1960-L1968

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`quantile()` returns rows from each input table with values that fall within a
specified quantile or returns the row with the value that represents the
specified quantile.

`quantile()` supports columns with float values.

### Function behavior
`quantile()` acts as an aggregate or selector transformation depending on the
specified `method`.

- **Aggregate**: When using the `estimate_tdigest` or `exact_mean` methods,
  `quantile()` acts as an aggregate transformation and outputs the average of
  non-null records with values that fall within the specified quantile.
- **Selector**: When using the `exact_selector` method, `quantile()` acts as
  a selector selector transformation and outputs the non-null record with the
  value that represents the specified quantile.

##### Function type signature

```js
(
    <-tables: stream[A],
    q: float,
    ?column: string,
    ?compression: float,
    ?method: string,
) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### column

Column to use to compute the quantile. Default is `_value`.



### q
({{< req >}})
Quantile to compute. Must be between `0.0` and `1.0`.



### method

Computation method. Default is `estimate_tdigest`.

**Available methods**:
- **estimate_tdigest**: Aggregate method that uses a
[t-digest data structure](https://github.com/tdunning/t-digest) to
compute an accurate quantile estimate on large data sources.
- **exact_mean**: Aggregate method that takes the average of the two
points closest to the quantile value.
- **exact_selector**: Selector method that returns the row with the value
for which at least `q` points are less than.

### compression

Number of centroids to use when compressing the dataset.
Default is `1000.0`.

A larger number produces a more accurate result at the cost of increased
memory requirements.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Quantile as an aggregate](#quantile-as-an-aggregate)
- [Quantile as a selector](#quantile-as-a-selector)

### Quantile as an aggregate

```js
import "sampledata"

sampledata.float()
    |> quantile(q: 0.99, method: "estimate_tdigest")

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
| t1   | 17.53   |

| *tag | _value  |
| ---- | ------- |
| t2   | 19.85   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Quantile as a selector

```js
import "sampledata"

sampledata.float()
    |> quantile(q: 0.5, method: "exact_selector")

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
