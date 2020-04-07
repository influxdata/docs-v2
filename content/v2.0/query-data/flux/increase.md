---
title: Calculate the increase
seotitle: Calculate the increase in Flux
list_title: Increase
description: >
  Use the [`increase()` function](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/increase/)
  to calculate the increase in values since the beginning of the series or table.
  This function is especially useful when tracking changes in counter values which
  wrap over time or periodically reset.
weight: 210
menu:
  v2_0:
    parent: Query with Flux
    name: Increase
v2.0/tags: [query, increase, counters]
list_code_example: |
  ```js
  data
    |> increase()
  ```
---

Use the [`increase()` function](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/increase/)
to calculate the increase of values in a table.
This function is especially useful when tracking changes in counter values which
wrap over time or periodically reset.

```js
data
  |> increase()
```

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _value |
|:----- | ------:|
| 0001  | 1      |
| 0002  | 2      |
| 0003  | 8      |
| 0004  | 10     |
| 0005  | 0      |
| 0006  | 4      |
{{% /flex-content %}}
{{% flex-content %}}
**`increase()` returns:**

| _time | _value |
|:----- | ------:|
| 0002  | 1      |
| 0003  | 7      |
| 0004  | 9      |
| 0005  | 9      |
| 0006  | 13     |
{{% /flex-content %}}
{{< /flex >}}
