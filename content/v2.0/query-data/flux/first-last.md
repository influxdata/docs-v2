---
title: Query first and last values
seotitle: Query first and last values in Flux
list_title: First and last
description: >
  Use the [`first()`](/v2.0/reference/flux/stdlib/built-in/transformations/selectors/first/) or
  [`last()`](/v2.0/reference/flux/stdlib/built-in/transformations/selectors/first/) functions
  to return the first or last point in an input table.
weight: 210
menu:
  v2_0:
    parent: Query with Flux
    name: First & last
v2.0/tags: [query]
list_code_example: |
  ```js
  data
    |> first()

  // OR

  data
    |> last()
  ```
---

Use the [`first()`](/v2.0/reference/flux/stdlib/built-in/transformations/selectors/first/) or
[`last()`](/v2.0/reference/flux/stdlib/built-in/transformations/selectors/first/) functions
to return the first or last point in an input table.

```js
data
  |> first()

// OR

data
  |> last()
```

{{% note %}}
By default, InfluxDB returns results sorted by time, however you can use the
[`sort()` function](/v2.0/reference/flux/stdlib/built-in/transformations/sort/)
to change how results are sorted.
**`first()` and `last()` respect the sorting of input tables.**
{{% /note %}}

### first
`first()` returns the first non-null record in an input table.

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _value |
| ----- |:------:|
| 0001  | 1.0    |
| 0002  | 1.0    |
| 0003  | 2.0    |
| 0004  | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**The following function returns:**
```js
|> first()
```

| _time | _value |
| ----- |:------:|
| 0001  | 1.0    |
{{% /flex-content %}}
{{< /flex >}}

### last
`first()` returns the last non-null record in an input table.

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _value |
| ----- |:------:|
| 0001  | 1.0    |
| 0002  | 1.0    |
| 0003  | 2.0    |
| 0004  | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**The following function returns:**

```js
|> last()
```

| _time | _value |
| ----- |:------:|
| 0004  | 3.0    |
{{% /flex-content %}}
{{< /flex >}}

## Use first() or last() with aggregateWindow()
[`aggregateWindow()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/)
segments data into windows of time, aggregates data in each window into a single
point, and then removes the time-based segmentation.
It is primarily used to [downsample data](/v2.0/process-data/common-tasks/downsample-data/).
`aggregateWindow` supports selector functions such as `first()` and `last()`.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[first](#)
[last](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
data
  |> aggregateWindow(every: 5m, fn: first)
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
data
  |> aggregateWindow(every: 5m, fn: last)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
