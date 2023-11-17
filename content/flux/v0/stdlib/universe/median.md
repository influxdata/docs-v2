---
title: median() function
description: >
  `median()` returns the median `_value` of an input table or all non-null records
  in the input table with values that fall within the 0.5 quantile (50th percentile).
menu:
  flux_v0_ref:
    name: median
    parent: universe
    identifier: universe/median
weight: 101
flux/v0/tags: [transformations, aggregates, selectors]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3994-L3996

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`median()` returns the median `_value` of an input table or all non-null records
in the input table with values that fall within the 0.5 quantile (50th percentile).

### Function behavior
`median()` acts as an aggregate or selector transformation depending on the
specified `method`.

- **Aggregate**: When using the `estimate_tdigest` or `exact_mean` methods,
  `median()` acts as an aggregate transformation and outputs the average of
  non-null records with values that fall within the 0.5 quantile (50th percentile).
- **Selector**: When using the `exact_selector` method, `meidan()` acts as
  a selector selector transformation and outputs the non-null record with the
  value that represents the 0.5 quantile (50th percentile).

##### Function type signature

```js
(<-tables: stream[A], ?column: string, ?compression: float, ?method: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Column to use to compute the median. Default is `_value`.



### method

Computation method. Default is `estimate_tdigest`.

**Available methods**:
- **estimate_tdigest**: Aggregate method that uses a
[t-digest data structure](https://github.com/tdunning/t-digest) to
compute an accurate median estimate on large data sources.
- **exact_mean**: Aggregate method that takes the average of the two
points closest to the median value.
- **exact_selector**: Selector method that returns the row with the value
for which at least 50% of points are less than.

### compression

Number of centroids to use when compressing the dataset.
Default is `0.0`.

A larger number produces a more accurate result at the cost of increased
memory requirements.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Use median as an aggregate transformation](#use-median-as-an-aggregate-transformation)
- [Use median as a selector transformation](#use-median-as-a-selector-transformation)

### Use median as an aggregate transformation

```js
import "sampledata"

sampledata.float()
    |> median()

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

### Use median as a selector transformation

```js
import "sampledata"

sampledata.float()
    |> median(method: "exact_selector")

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
