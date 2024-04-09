---
title: display() function
description: >
  `display()` returns the Flux literal representation of any value as a string.
menu:
  flux_v0_ref:
    name: display
    parent: universe
    identifier: universe/display
weight: 101

introduced: 0.154.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3538-L3538

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`display()` returns the Flux literal representation of any value as a string.

Basic types are converted directly to a string.
Bytes types are represented as a string of lowercase hexadecimal characters prefixed with `0x`.
Composite types (arrays, dictionaries, and records) are represented in a syntax similar
to their equivalent Flux literal representation.

Note the following about the resulting string representation:
- It cannot always be parsed back into the original value.
- It may span multiple lines.
- It may change between Flux versions.

`display()` differs from `string()` in that `display()` recursively converts values inside
composite types to strings. `string()` does not operate on composite types.

##### Function type signature

```js
(v: A) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to convert for display.




## Examples

- [Display a value as part of a table](#display-a-value-as-part-of-a-table)
- [Display a record](#display-a-record)
- [Display an array](#display-an-array)
- [Display a dictionary](#display-a-dictionary)
- [Display bytes](#display-bytes)
- [Display a composite value](#display-a-composite-value)

### Display a value as part of a table

Use `array.from()` and `display()` to quickly observe any value.

```js
import "array"

array.from(
    rows: [
        {
            dict: display(v: ["a": 1, "b": 2]),
            record: display(v: {x: 1, y: 2}),
            array: display(v: [5, 6, 7]),
        },
    ],
)

```


### Display a record

```js
x = {a: 1, b: 2, c: 3}

display(v: x)// Returns {a: 1, b: 2, c: 3}


```


### Display an array

```js
x = [1, 2, 3]

display(v: x)// Returns [1, 2, 3]


```


### Display a dictionary

```js
x = ["a": 1, "b": 2, "c": 3]

display(v: x)// Returns [a: 1, b: 2, c: 3]


```


### Display bytes

```js
x = bytes(v: "abc")

display(v: x)// Returns 0x616263


```


### Display a composite value

```js
x = {bytes: bytes(v: "abc"), string: "str", array: [1, 2, 3], dict: ["a": 1, "b": 2, "c": 3]}

display(v: x)// Returns
// {
//    array: [1, 2, 3],
//    bytes: 0x616263,
//    dict: [a: 1, b: 2, c: 3],
//    string: str
// }


```

