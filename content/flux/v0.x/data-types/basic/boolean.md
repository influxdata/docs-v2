---
title: Work with booleans
list_title: Boolean
description: >
  Learn how to work with boolean data types in Flux.
menu:
  flux_0_x:
    name: Boolean
    parent: Basic types
weight: 201
flux/v0.x/tags: ["basic types", "data types"]
---

A **boolean** type represents a truth value (`true` or `false`).

**Type name**: `bool`

###### On this page:
- [Boolean syntax](#boolean-syntax)
- [Convert data types to booleans](#convert-data-types-to-booleans)
- [Negate boolean values](#negate-boolean-values)

## Boolean syntax
Boolean literals are represented by the following:

```js
true
false
```

## Convert data types to booleans
Use the [`bool()` function](/flux/v0.x/stdlib/universe/bool/) to convert
the following [basic types](/flux/v0.x/data-types/basic/) to booleans:

- **string**: value must be `"true"` or `"false"`.
- **float**: value must be `0.0` (false) or `1.0` (true).
- **int**: value must be `0` (false) or `1` (true).
- **uint**: value must be `0` (false) or `1` (true).

```js
bool(v: "true")
// Returns true

bool(v: 0.0)
// Returns false

bool(v: uint(v: 1))
// Returns true
```

### Convert columns to booleans
Flux lets you iterate over rows in a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
and convert columns to booleans.

**To convert the `_value` column to booleans**, use the [`toBool()` function](/flux/v0.x/stdlib/universe/bool/).

{{% note %}}
`toBool()` only operates on the `_value` column.
{{% /note %}}

```js
data
  |> toBool()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
| \_time               | \_value _<span style="opacity:.5">(float)</span>_ |
| :------------------- | ------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                               1.0 |
| 2021-01-01T02:00:00Z |                                               0.0 |
| 2021-01-01T03:00:00Z |                                               0.0 |
| 2021-01-01T04:00:00Z |                                               1.0 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value _<span style="opacity:.5">(bool)</span>_ |
| :------------------- | -----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                             true |
| 2021-01-01T02:00:00Z |                                            false |
| 2021-01-01T03:00:00Z |                                            false |
| 2021-01-01T04:00:00Z |                                             true |
{{% /flex-content %}}
{{< /flex >}}

**To convert any column to booleans**:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`bool()`](/flux/v0.x/stdlib/universe/bool/) to convert columns values to booleans.

```js
data
  |> map(fn: (r) => ({ r with running: bool(v: r.running) }))
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
| \_time               | running _<span style="opacity:.5">(int)</span>_ |
| :------------------- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                               1 |
| 2021-01-01T02:00:00Z |                                               0 |
| 2021-01-01T03:00:00Z |                                               0 |
| 2021-01-01T04:00:00Z |                                               1 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | running _<span style="opacity:.5">(bool)</span>_ |
| :------------------- | -----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                             true |
| 2021-01-01T02:00:00Z |                                            false |
| 2021-01-01T03:00:00Z |                                            false |
| 2021-01-01T04:00:00Z |                                             true |
{{% /flex-content %}}
{{< /flex >}}

## Negate boolean values
To negate boolean values, use the [`not` logical operator](flux/v0.x/spec/operators/#logical-operators).

```js
not true
// Returns false

not false
// Returns true
```
