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
  - /flux/v0.x/stdlib/contrib/bonitoo-io/hex/bytes/
---

A **bytes** type represents a sequence of byte values.

**Type name**: `bytes`

- [Bytes syntax](#bytes-syntax)
- [Convert a column to bytes](#convert-a-column-to-bytes)

## Bytes syntax
Flux does not provide a bytes literal syntax.
Use the [`bytes()` function](/flux/v0.x/stdlib/universe/bytes/) to convert a
**string** into bytes.

```js
bytes(v: "hello")
// Returns [104 101 108 108 111]
```

{{% note %}}
Only string types can be converted to bytes.
{{% /note %}}

## Convert strings to bytes
Use `bytes()` or `hex.bytes()` to convert strings to bytes.

- [`bytes()`](/flux/v0.x/stdlib/universe/bytes/): Convert a string to bytes
- [`hex.bytes()`](/flux/v0.x/stdlib/contrib/bonitoo-io/hex/bytes/): Decode hexadecimal value and covert it to bytes.

#### Convert a hexadecimal string to bytes
```js
import "contrib/bonitoo-io/hex"

hex.bytes(v: "FF5733")
// Returns [255 87 51] (bytes)
```
