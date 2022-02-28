---
title: display() function
description: >
  `display()` returns the Flux literal representation of any value as a string.
menu:
  flux_0_x_ref:
    name: display
    parent: universe
weight: 102
introduced: 0.154.0
---

`display()` returns the Flux literal representation of any value as a string.

```js
display(v: "example value")
```

[Basic types](/flux/v0.x/data-types/basic/) are converted directly to a string.
[Bytes types](/flux/v0.x/data-types/basic/bytes/) are represented as a string of
lowercase hexadecimal characters prefixed with `0x`.
[Composite types](/flux/v0.x/data-types/composite/) (arrays, dictionaries, and records)
are represented in a syntax similar to their equivalent Flux literal representation.

Note the following about the resulting string representation:

- It cannot always be parsed back into the original value.
- It may span multiple lines.
- It may change between Flux versions.

{{% note %}}
`display()` differs from [`string()`](/flux/v0.x/stdlib/universe/string/) in
that `display()` recursively converts values inside composite types to strings.
`string()` does not operate on composite types.
{{% /note %}}

## Parameters

### v
Value to convert for display.

## Examples

- [Display composite values as part of a table](#display-composite-values-as-part-of-a-table)
- [Display a record](#display-a-record)
- [Display an array](#display-an-array)
- [Display a dictionary](#display-a-dictionary)
- [Display bytes](#display-bytes)
- [Display a composite value](#display-a-composite-value)

### Display composite values as part of a table
Use [`array.from()`](/flux/v0.x/stdlib/array/from/) and `display()` to quickly
observe any value.

```js
import "array"

array.from(
    rows: [
        {
            dict: display(v: ["a":1, "b": 2]),
            record: display(v:{x: 1, y: 2}),
            array: display(v: [5,6,7])
        }
    ]
)
```

#### Output data
| dict         | record       | array     |
| :----------- | :----------- | :-------- |
| [a: 1, b: 2] | {x: 1, y: 2} | [5, 6, 7] |

### Display a record
```js
x = {a: 1, b: 2, c: 3}

display(v: x)

// Returns {a: 1, b: 2, c: 3}
```

### Display an array
```js
x = [1, 2, 3]

display(v: x)

// Returns [1, 2, 3]
```

### Display a dictionary
```js
x = ["a": 1, "b": 2, "c": 3]

display(v: x)

// Returns [a: 1, b: 2, c: 3]
```

### Display bytes
```js
x = bytes(v:"abc")

display(v: x)

// Returns 0x616263
```

### Display a composite value
```js
x = {
    bytes: bytes(v: "abc"),
    string: "str",
    array: [1,2,3],
    dict: ["a": 1, "b": 2, "c": 3],
}

display(v: x)

// Returns
// {
//    array: [1, 2, 3],
//    bytes: 0x616263,
//    dict: [a: 1, b: 2, c: 3],
//    string: str
// }
```