---
title: Work with null types
list_title: "Null"
description: >
  Learn how to work with null types in Flux.
menu:
  flux_0_x:
    name: "Null"
    parent: Basic types
weight: 204
flux/v0.x/tags: ["basic types", "data types"]
---

The **null type** represents a missing or unknown value.

**Type name**: `null`

## Null syntax
Null types exist in [columns](/flux/v0.x/get-started/data-model/#column) of
other [basic types](/flux/v0.x/data-types/basic/), but there is no literal syntax
to represent a _null_ value.

{{% note %}}
An empty string (`""`) **is not** a _null_ value.
{{% /note %}}

## Check if a column value is null
In functions that iterate over rows (such as [`filter()`](/flux/v0.x/stdlib/universe/filter/)
or [`map()`](/flux/v0.x/stdlib/universe/map/)), use the
[`exists` logical operator](/flux/v0.x/spec/operators/#logical-operators) to check
if a column value is _null_.

##### Filter out rows with null values
```js
data
  |> filter(fn: (r) => exists r._value)
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time               | \_value |
| :------------------- | ------: |
| 2021-01-01T00:00:00Z |     1.2 |
| 2021-01-01T02:00:00Z |         |
| 2021-01-01T03:00:00Z |     2.5 |
| 2021-01-01T04:00:00Z |         |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value |
| :------------------- | ------: |
| 2021-01-01T00:00:00Z |     1.2 |
| 2021-01-01T03:00:00Z |     2.5 |
{{% /flex-content %}}
{{< /flex >}}

