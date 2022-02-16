---
title: array.map() function
description: >
  `array.map` iterates over an array, applies a function to each element to
  produce a new element, and then returns a new array.
menu:
  flux_0_x_ref:
    name: array.map
    parent: exp-array
weight: 301
flux/v0.x/tags: [array]
introduced: 0.155.0
---

`array.map()` iterates over an array, applies a function to each element to
produce a new element, and then returns a new array.

```js
import "experimental/array"

array.map(
    arr: [1, 2, 3, 4],
    fn: (x) => x * 2,
)

// Returns [2, 4, 6, 8]
```

## Parameters

### arr {data-type="array"}
Array to operate on. Default is the piped-forward array (`<-`).

### fn {data-type="function"}
Function to apply to elements. The element is represented by `x` in the function.

## Examples

### Convert an array of integers to an array of records
```js
import "experimental/array"

a = [1, 2, 3, 4, 5]
b = a |> array.map(fn: (x) => ({_value: x}))
// b returns [{_value: 1}, {_value: 2}, {_value: 3}, {_value: 4}, {_value: 5}]

// Output the array of records as a table
> array.from(rows: b)
```

### Iterate over and modify an array of records
```js
a = [
   {a: 1, b: 2, c: 3},
   {a: 4, b: 5, c: 6},
   {a: 7, b: 8, c: 9},
]

b = a |> array.map(fn: (x) => ({x with a: x.a * x.a, d: x.b + x.c}))
// b returns:
// [
//     {a: 1, b: 2, c: 3, d: 5},
//     {a: 16, b: 5, c: 6, d: 11},
//     {a: 49, b: 8, c: 9, d: 17}
// ]

// Output the modified array of records as a table
array.from(rows: b)
```
