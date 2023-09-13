---
title: Work with bytes types
list_title: Bytes
description: >
  A **bytes** type represents a sequence of byte values.
  Learn how to work with bytes data types in Flux.
menu:
  flux_v0:
    name: Bytes
    parent: Basic types
weight: 201
flux/v0.x/tags: ["basic types", "data types"]
related:
  - /flux/v0/stdlib/universe/bytes/
  - /flux/v0/stdlib/contrib/bonitoo-io/hex/bytes/
---

A **bytes** type represents a sequence of byte values.

**Type name**: `bytes`

- [Bytes syntax](#bytes-syntax)
- [Convert a column to bytes](#convert-a-column-to-bytes)
- [Include the string representation of bytes in a table](#include-the-string-representation-of-bytes-in-a-table)

## Bytes syntax
Flux does not provide a bytes literal syntax.
Use the [`bytes()` function](/flux/v0/stdlib/universe/bytes/) to convert a
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

- [`bytes()`](/flux/v0/stdlib/universe/bytes/): Convert a string to bytes
- [`hex.bytes()`](/flux/v0/stdlib/contrib/bonitoo-io/hex/bytes/): Decode hexadecimal value and convert it to bytes.

#### Convert a hexadecimal string to bytes
```js
import "contrib/bonitoo-io/hex"

hex.bytes(v: "FF5733")
// Returns [255 87 51] (bytes)
```

## Include the string representation of bytes in a table

Use [`display()`](/flux/v0/stdlib/universe/display/) to return the string
representation of bytes and include it as a column value.
`display()` represents bytes types as a string of lowercase hexadecimal
characters prefixed with `0x`.

```js
import "sampledata"

sampledata.string()
    |> map(fn: (r) => ({r with _value: display(v: bytes(v: r._value))}))
```

#### Output

| tag | _time                | _value <em style="opacity:.5">(string)</em> |
| --- | :------------------- | ------------------------------------------: |
| t1  | 2021-01-01T00:00:00Z |                    0x736d706c5f673971637a73 |
| t1  | 2021-01-01T00:00:10Z |                    0x736d706c5f306d6776396e |
| t1  | 2021-01-01T00:00:20Z |                    0x736d706c5f706877363634 |
| t1  | 2021-01-01T00:00:30Z |                    0x736d706c5f6775767a7934 |
| t1  | 2021-01-01T00:00:40Z |                    0x736d706c5f357633636365 |
| t1  | 2021-01-01T00:00:50Z |                    0x736d706c5f7339666d6779 |

| tag | _time                | _value <em style="opacity:.5">(string)</em> |
| --- | :------------------- | ------------------------------------------: |
| t2  | 2021-01-01T00:00:00Z |                    0x736d706c5f623565696461 |
| t2  | 2021-01-01T00:00:10Z |                    0x736d706c5f6575346f7870 |
| t2  | 2021-01-01T00:00:20Z |                    0x736d706c5f356737747a34 |
| t2  | 2021-01-01T00:00:30Z |                    0x736d706c5f736f78317574 |
| t2  | 2021-01-01T00:00:40Z |                    0x736d706c5f77666d373537 |
| t2  | 2021-01-01T00:00:50Z |                    0x736d706c5f64746e326276 |
