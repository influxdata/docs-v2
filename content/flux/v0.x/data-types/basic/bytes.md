---
title: Work with bytes types
list_title: Bytes
description: >
  A **bytes** type represents a sequence of byte values.
  Learn how to work with bytes data types in Flux.
menu:
  flux_0_x:
    name: Bytes
    parent: Basic types
weight: 201
flux/v0.x/tags: ["basic types", "data types"]
related:
  - /flux/v0.x/stdlib/universe/bytes/
---

A **bytes** type represents a sequence of byte values.

**Type name**: `bytes`

###### On this page
- [Bytes syntax](#bytes-syntax)
- [Convert a column to bytes](#convert-a-column-to-bytes)

## Bytes syntax
Flux does not provide a bytes literal syntax.
Use the [`bytes()` function](/flux/v0.x/stdlib/universe/bytes) to convert a
**string** into bytes.

```js
bytes(v: "hello")
// Returns [104 101 108 108 111]
```

{{% note %}}
Only string types can be converted to bytes.
{{% /note %}}

## Convert a column to bytes

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`bytes()`](/flux/v0.x/stdlib/universe/bytes/) to convert column values to bytes.

```js
data
  |> map(fn: (r) => ({ r with _value: time(v: r._value) }))
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
| \_time               | \_value _<span style="opacity:.5">(string)</span>_ |
| :------------------- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                                foo |
| 2021-01-01T02:00:00Z |                                                bar |
| 2021-01-01T03:00:00Z |                                                baz |
| 2021-01-01T04:00:00Z |                                                quz |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value _<span style="opacity:.5">(bytes)</span>_ |
| :------------------- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                      [102 111 111] |
| 2021-01-01T02:00:00Z |                                        [98 97 114] |
| 2021-01-01T03:00:00Z |                                        [98 97 122] |
| 2021-01-01T04:00:00Z |                                      [113 117 122] |
{{% /flex-content %}}
{{< /flex >}}
