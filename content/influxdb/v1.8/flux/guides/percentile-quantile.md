---
title: Find percentile and quantile values
seotitle: Query percentile and quantile values in Flux
list_title: Percentile & quantile
description: >
  Use the `quantile()` function to return all values within the `q` quantile or
  percentile of input data.
weight: 10
menu:
  influxdb_1_8:
    parent: Query with Flux
    name: Percentile & quantile
list_query_example: quantile
canonical: /{{< latest "influxdb" "v2" >}}/query-data/flux/percentile-quantile/
v2: /influxdb/v2.0/query-data/flux/percentile-quantile/
---

Use the [`quantile()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/quantile/)
to return a value representing the `q` quantile or percentile of input data.

## Percentile versus quantile
Percentiles and quantiles are very similar, differing only in the number used to calculate return values.
A percentile is calculated using numbers between `0` and `100`.
A quantile is calculated using numbers between `0.0` and `1.0`.
For example, the **`0.5` quantile** is the same as the **50th percentile**.

## Select a method for calculating the quantile
Select one of the following methods to calculate the quantile:

- [estimate_tdigest](#estimate-tdigest)
- [exact_mean](#exact-mean)
- [exact_selector](#exact-selector)

### estimate_tdigest
**(Default)** An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute a quantile estimate on large data sources.
Output tables consist of a single row containing the calculated quantile.

If calculating the `0.5` quantile or 50th percentile:

{{< flex >}}
{{% flex-content %}}
**Given the following input table:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**`estimate_tdigest` returns:**

| _value |
|:------:|
| 1.5    |
{{% /flex-content %}}
{{< /flex >}}

### exact_mean
An aggregate method that takes the average of the two points closest to the quantile value.
Output tables consist of a single row containing the calculated quantile.

If calculating the `0.5` quantile or 50th percentile:

{{< flex >}}
{{% flex-content %}}
**Given the following input table:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**`exact_mean` returns:**

| _value |
|:------:|
| 1.5    |
{{% /flex-content %}}
{{< /flex >}}

### exact_selector
A selector method that returns the data point for which at least `q` points are less than.
Output tables consist of a single row containing the calculated quantile.

If calculating the `0.5` quantile or 50th percentile:

{{< flex >}}
{{% flex-content %}}
**Given the following input table:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**`exact_selector` returns:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:02:00Z | 1.0    |
{{% /flex-content %}}
{{< /flex >}}

{{% note %}}
The examples below use the [example data variable](/influxdb/v1.8/flux/guides/#example-data-variable).
{{% /note %}}

## Find the value representing the 99th percentile
Use the default method, `"estimate_tdigest"`, to return all rows in a table that
contain values in the 99th percentile of data in the table.

```js
data
  |> quantile(q: 0.99)
```

## Find the average of values closest to the quantile
Use the `exact_mean` method to return a single row per input table containing the
average of the two values closest to the mathematical quantile of data in the table.
For example, to calculate the `0.99` quantile:

```js
data
  |> quantile(q: 0.99, method: "exact_mean")
```

## Find the point with the quantile value
Use the `exact_selector` method to return a single row per input table containing the
value that `q * 100`% of values in the table are less than.
For example, to calculate the `0.99` quantile:

```js
data
  |> quantile(q: 0.99, method: "exact_selector")
```

## Use quantile() with aggregateWindow()
[`aggregateWindow()`](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/)
segments data into windows of time, aggregates data in each window into a single
point, and then removes the time-based segmentation.
It is primarily used to downsample data.

To specify the [quantile calculation method](#select-a-method-for-calculating-the-quantile) in
`aggregateWindow()`, use the [full function syntax](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/#specify-parameters-of-the-aggregate-function):

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: (tables=<-, column) =>
      tables
        |> quantile(q: 0.99, method: "exact_selector")
  )
```
