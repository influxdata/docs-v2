---
title: Work with null types
list_title: "Null"
description: >
  The **null type** represents a missing or unknown value.
  Learn how to work with null types in Flux.
menu:
  flux_v0:
    name: "Null"
    parent: Basic types
weight: 204
related: 
  - /flux/v0/stdlib/internal/debug/null/
flux/v0.x/tags: ["basic types", "data types"]
---

The **null type** represents a missing or unknown value.

**Type name**: `null`

- [Null syntax](#null-syntax)
- [Check if a column value is null](#check-if-a-column-value-is-null)
- [Include null values in an ad hoc stream of tables](#include-null-values-in-an-ad-hoc-stream-of-tables)

## Null syntax
Null types exist in [columns](/flux/v0/get-started/data-model/#column) of
other [basic types](/flux/v0/data-types/basic/).
Flux does not provide a literal syntax for a _null_ value, however, you can use
[`debug.null()`](/flux/v0/stdlib/internal/debug/null/) to return a null value
of a specified type.

```js
import "internal/debug"

// Return a null string
debug.null(type: "string")

// Return a null integer
debug.null(type: "int")

// Return a null boolean
debug.null(type: "bool")
```

{{% note %}}
An empty string (`""`) **is not** a _null_ value.
{{% /note %}}

## Check if a column value is null
In functions that iterate over rows (such as [`filter()`](/flux/v0/stdlib/universe/filter/)
or [`map()`](/flux/v0/stdlib/universe/map/)), use the
[`exists` logical operator](/flux/v0/spec/operators/#logical-operators) to check
if a column value is _null_.

##### Filter out rows with null values
```js
data
    |> filter(fn: (r) => exists r._value)
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
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

## Include null values in an ad hoc stream of tables

1. Use [`array.from()`](/flux/v0/stdlib/array/from/) to create an ad hoc stream of tables.
2. Use [`debug.null()`](/flux/v0/stdlib/internal/debug/null/) to include null
   column values.

```js
import "array"
import "internal/debug"

array.from(
    rows: [
        {a: 1, b: 2, c: 3, d: "four"},
        {a: debug.null(type: "int"), b: 5, c: 6, d: debug.null(type: "string")}
    ]
)
```

##### The example above returns:
|  a  |  b  |  c  |  d   |
| :-: | :-: | :-: | :--: |
|  1  |  2  |  3  | four |
|     |  5  |  6  |      |
