---
title: Calculate the rate of change
seotitle: Calculate the rate of change in Flux
list_title: Rate
description: >
  Use the [`aggregate.rate()` function](/v2.0/reference/flux/stdlib/experimental/aggregate/rate/)
  to calculate the average rate of change per window of time.
weight: 210
menu:
  v2_0:
    parent: Query with Flux
    name: Rate
v2.0/tags: [query, rate]
related:
  - /v2.0/reference/flux/stdlib/experimental/aggregate/rate/
list_code_example: |
  ```js
  import "experimental/aggregate"

  data
    |> aggregate.rate(every: 1m, unit: 1s )
  ```
---

Use the [`aggregate.rate()` function](/v2.0/reference/flux/stdlib/experimental/aggregate/rate/)
to calculate the average rate of change per window of time.

```js
import "experimental/aggregate"

data
  |> aggregate.rate(
    every: 1m,
    unit: 1s,
    groupColumns: ["tag1", "tag2"]
  )
```

`aggregate.rate()` returns the average rate of change per `unit` for time intervals defined by `every`.

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 250    |
| 2020-01-01T00:10:00Z | 160    |
| 2020-01-01T00:20:00Z | 150    |
| 2020-01-01T00:30:00Z | 220    |
| 2020-01-01T00:40:00Z | 200    |
| 2020-01-01T00:50:00Z | 290    |
| 2020-01-01T01:00:00Z | 340    |
{{% /flex-content %}}
{{% flex-content %}}
**The following returns:**

```js
  |> aggregate.rate(
    every: 20m,
    unit: 1m
  )
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:40:00Z | 7      |
| 2020-01-01T01:00:00Z | 9      |
| 2020-01-01T01:10:00Z | 5      |
{{% /flex-content %}}
{{< /flex >}}

_Results represent the **average change rate per minute** of every **20 minute interval**._
