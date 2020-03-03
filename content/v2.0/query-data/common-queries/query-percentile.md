---
title: Query percentile values
seotitle: Query percentile values in Flux
description: >
    placeholder
weight: 201
menu:
  v2_0:
    parent: Common queries
v2.0/tags: [query, percentile, quantile]
related:
  - /v2.0/query-data/common-queries/query-median/
---

Use the [`quantile()` function](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/quantile/)
to return all values within the `q` quantile or percentile of input data.

## Percentile versus quantile
Percentiles and quantiles are very similar, differing only in the number used to calculate return values.
A percentile is calculated using numbers between `0` and `100`.
A quantile is calculated using numbers between `0.0` and `1.0`.
For example, the **`0.5` quantile** is the same as the **50th percentile**.

## Quantile calculation methods
Select from the following methods for calculating the quantile:

##### estimate_tdigest
(Default) An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate quantile estimate on large data sources.
Returns all values in the `q` quantile.

##### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.
Output tables consist of a single row containing the calculated quantile.

##### exact_selector
A selector method that returns the data point for which at least `q` points are less than.
Output tables consist of a single row containing the calculated quantile.

{{% note %}}
#### Example data variable
To focus on using the `quantile()` function, the examples below use a `data` variable
which represents a base queried dataset.

```js
data = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
```
{{% /note %}}

## Query all values in the 50th percentile
Use the default method, `"estimate_tdigest"`, to return all rows in a table that
contain values in the 50th percentile of data in the table.

```js
data
  |> quantile(q: 0.99)
```

## Query the average of values closest to the quantile
Use the `exact_mean` method to return a single row per input table containing the
average of the two values closest to the mathematical quantile of data in the table.

```js
data
  |> quantile(q: 0.99, method: "exact_mean")
```

## Query the quantile value
Use the `exact_selector` method to return a single row per input table containing the
value that 50% of values in the table are less than.

```js
data
  |> quantile(q: 0.99, method: "exact_selector")
```

## Use quantile with aggregateWindow()
[`aggregateWindow()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/)
segments data into windows of time, aggregates data in each window into a single
point, then removes the time-based segmentation.
It is primarily used to [downsample data](/v2.0/process-data/common-tasks/downsample-data/).

`aggregateWindow()` expects a single point from each time window.
Use either the `exact_mean` or `exact_mode` quantile calculation method.

To specify parameters of the aggregate function in `aggregateWindow()`, use the
[full function syntax](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/#specify-parameters-of-the-aggregate-function):

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: (tables=<-, column) =>
      tables
        |> quantile(q: 0.99, method: "exact_selector")
  )
```
