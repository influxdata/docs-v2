---
title: Calculate the moving average
seotitle: Calculate the moving average in Flux
list_title: Moving Average
description: >
  Use the [`movingAverage()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/movingaverage/)
  or [`timedMovingAverage()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/timedmovingaverage/)
  functions to return the moving average of data.
weight: 210
menu:
  v2_0:
    parent: Query with Flux
    name: Moving Average
v2.0/tags: [query, moving average]
list_code_example: |
  ```js
  data
    |> movingAverage(n: 5)

  // OR

  data
    |> timedMovingAverage(every: 5m, period: 10m)
  ```
---

Use the [`movingAverage()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/movingaverage/)
or [`timedMovingAverage()`](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/timedmovingaverage/)
functions to return the moving average of data.

```js
data
  |> movingAverage(n: 5)

// OR

data
  |> timedMovingAverage(every: 5m, period: 10m)
```

#### movingAverage()
For each row in a table, `movingAverage()` returns the average of the current
value and the previous `n-1` values.

#### timedMovingAverage()
For each row in a table, `timedMovingAverage()` returns the the average of the
current value and all values in the previous `period` (duration).
It returns moving averages at a frequency defined by the `every` parameter.

**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.2    |
| 2020-01-01T00:03:00Z | 1.8    |
| 2020-01-01T00:04:00Z | 0.9    |
| 2020-01-01T00:05:00Z | 1.4    |
| 2020-01-01T00:06:00Z | 2.0    |

**The following functions would return:**

---

{{< flex >}}
{{% flex-content %}}
**Function:**  

```js
// ...
  |> movingAverage(n: 3)
```
{{% /flex-content %}}
{{% flex-content %}}
**Output:**  

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:03:00Z | 1.33   |
| 2020-01-01T00:04:00Z | 1.30   |
| 2020-01-01T00:05:00Z | 1.06   |
| 2020-01-01T00:06:00Z | 1.43   |
{{% /flex-content %}}
{{< /flex >}}

---

{{< flex >}}
{{% flex-content %}}
**Function:**  

```js
// ...
  |> timedMovingAverage(
    every: 2m,
    period: 4m
  )
```
{{% /flex-content %}}
{{% flex-content %}}
**Output:**  

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:04:00Z | 1.23   |
| 2020-01-01T00:06:00Z | 1.53   |
{{% /flex-content %}}
{{< /flex >}}
