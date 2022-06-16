---
title: array.filter() function
description: >
  `array.filter()` iterates over an array, evaluates each element with a predicate function, and then returns
  a new array with only elements that match the predicate.
menu:
  flux_0_x_ref:
    name: array.filter
    parent: experimental/array
    identifier: experimental/array/filter
weight: 201

introduced: 0.155.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L136-L136

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.filter()` iterates over an array, evaluates each element with a predicate function, and then returns
a new array with only elements that match the predicate.



##### Function type signature

```js
array.filter = (<-arr: [A], fn: (x: A) => bool) => [A]
```

## Parameters

### arr


Array to filter. Default is the piped-forward array (`<-`).

### fn

({{< req >}})
Predicate function to evaluate on each element.
The element is represented by `x` in the predicate function.


## Examples


### Filter array of integers

```js
import "experimental/array"

a = [
    1,
    2,
    3,
    4,
    5,
]
b = a |> array.filter(fn: (x) => x >= 3)

// b returns [3, 4, 5]
// Output the filtered array as a table
array.from(rows: b |> array.map(fn: (x) => ({_value: x})))
```


#### Output data

| _value  |
| ------- |
| 3       |
| 4       |
| 5       |

