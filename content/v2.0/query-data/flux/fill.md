---
title: Fill null values in data
seotitle: Fill null values in data
list_title: Fill
description: >
  Use the [`fill()` function](/v2.0/reference/flux/stdlib/built-in/transformations/fill/)
  to replace _null_ values.
weight: 210
menu:
  v2_0:
    parent: Query with Flux
    name: Fill
v2.0/tags: [query, fill]
list_code_example: |
  ```js
  data
    |> fill(usePrevious: true)
  ```
---

Use the [`fill()` function](/v2.0/reference/flux/stdlib/built-in/transformations/fill/)
to replace _null_ values with:

- [the previous non-null value](#fill-with-the-previous-value)
- [a specified value](#fill-with-a-specified-value)

<!-- -->
```js
data
  |> fill(usePrevious: true)

// OR

data
  |> fill(value: 0.0)
```

{{% note %}}
#### Fill empty windows of time
The `fill()` function **does not** fill empty windows of time.
It only replaces _null_ values in existing data.
Filling empty windows of time requires time interpolation
_(see [influxdata/flux#2428](https://github.com/influxdata/flux/issues/2428))_.
{{% /note %}}

## Fill with the previous value
To fill _null_ values with the previous **non-null** value, set the `usePrevious` parameter to `true`.

{{% note %}}
Values remain _null_ if there is no previous non-null value in the table.
{{% /note %}}

```js
data
  |> fill(usePrevious: true)
```

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _value |
|:----- | ------:|
| 0001  | null   |
| 0002  | 0.8    |
| 0003  | null   |
| 0004  | null   |
| 0005  | 1.4    |
{{% /flex-content %}}
{{% flex-content %}}
**`fill(usePrevious: true)` returns:**

| _time | _value |
|:----- | ------:|
| 0001  | null   |
| 0002  | 0.8    |
| 0003  | 0.8    |
| 0004  | 0.8    |
| 0005  | 1.4    |
{{% /flex-content %}}
{{< /flex >}}

## Fill with a specified value
To fill _null_ values with a specified value, use the `value` parameter to specify the fill value.
_The fill value must match the [data type](/v2.0/reference/flux/language/types/#basic-types)
of the [column](/v2.0/reference/flux/stdlib/built-in/transformations/fill/#column)._

```js
data
  |> fill(value: 0.0)
```

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _value |
|:----- | ------:|
| 0001  | null   |
| 0002  | 0.8    |
| 0003  | null   |
| 0004  | null   |
| 0005  | 1.4    |
{{% /flex-content %}}
{{% flex-content %}}
**`fill(value: 0.0)` returns:**

| _time | _value |
|:----- | ------:|
| 0001  | 0.0    |
| 0002  | 0.8    |
| 0003  | 0.0    |
| 0004  | 0.0    |
| 0005  | 1.4    |
{{% /flex-content %}}
{{< /flex >}}
