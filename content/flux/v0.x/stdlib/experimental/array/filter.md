---
title: array.filter() function
description: >
  `array.filter` iterates over an array, evaluates each element with a predicate
  function, and then returns a new array with only elements that match the predicate.
menu:
  flux_0_x_ref:
    name: array.filter
    parent: exp-array
weight: 301
flux/v0.x/tags: [array]
introduced: 0.155.0
---

`array.filter()` iterates over an array, evaluates each element with a predicate
function, and then returns a new array with only elements that match the predicate.

```js
import "experimental/array"

array.filter(
    arr: [1, 2, 3, 4, 5],
    fn: (x) => x >= 3,
)

// Returns [3, 4, 5]
```

## Parameters

### arr {data-type="array"}
Array to filter. Default is the piped-forward array (`<-`).

### fn {data-type="function"}
Predicate function to evaluate on each element.
The element is represented by `x` in the predicate function.

## Examples

### Filter an array of integers
```js
import "experimental/array"

a = [1, 2, 3, 4, 5]
b = a |> array.filter(fn: (x) => x >= 3)
// b returns [3, 4, 5]

// Output the filtered array as a table
array.from(rows: b |> array.map(fn: (x) => ({_value: x})))
```

### Filter an array of records
```js
import "experimental/array"

a = [
   {a: 1, b: 2, c: 3},
   {a: 4, b: 5, c: 6},
   {a: 7, b: 8, c: 9},
]

b = a |> array.filter(fn: (x) => x.b >= 3)
// b returns [
//    {a: 4, b: 5, c: 6},
//    {a: 7, b: 8, c: 9},
// ]

// Output the filtered array as a table
array.from(rows: b)
```
