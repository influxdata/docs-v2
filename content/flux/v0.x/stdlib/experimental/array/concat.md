---
title: array.concat() function
description: >
  `array.concat` appends two arrays and returns a new array.
menu:
  flux_0_x_ref:
    name: array.concat
    parent: exp-array
weight: 301
flux/v0.x/tags: [array]
introduced: 0.155.0
---

`array.concat()` appends two arrays and returns a new array.

```js
import "experimental/array"

array.concat(
    arr: [1,2],
    v: [3,4],
)

// Returns [1, 2, 3, 4]
```

## Parameters

### arr {data-type="array"}
First array. Default is the piped-forward array (`<-`).

### v {data-type="array"}
Array to append to the first array.

{{% note %}}
Neither input array is mutated and a new array is returned.
{{% /note %}}

## Examples

### Merge two arrays
```js
import "experimental/array"

a = [1, 2, 3]
b = [4, 5, 6]

c = a |> array.concat(v: b)
// Returns [1, 2, 3, 4, 5, 6]

// Output each value in the array as a row in a table
array.from(rows: c |> array.map(fn: (x) => ({_value: x})))
```
