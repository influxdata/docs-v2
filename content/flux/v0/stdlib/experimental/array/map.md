---
title: array.map() function
description: >
  `array.map()` iterates over an array, applies a function to each element to produce a new element,
  and then returns a new array.
menu:
  flux_v0_ref:
    name: array.map
    parent: experimental/array
    identifier: experimental/array/map
weight: 201

introduced: 0.155.0
deprecated: 0.173.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L118-L118

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.map()` iterates over an array, applies a function to each element to produce a new element,
and then returns a new array.

{{% warn %}}
#### Deprecated
Experimental `array.map()` is deprecated in favor of
[`array.map()`](/flux/v0/stdlib/array/map).
{{% /warn %}}

##### Function type signature

```js
(<-arr: [A], fn: (x: A) => B) => [B]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### arr

Array to operate on. Defaults is the piped-forward array (`<-`).



### fn
({{< req >}})
Function to apply to elements. The element is represented by `x` in the function.




## Examples

### Convert an array of integers to an array of records

```js
import "experimental/array"

a = [
    1,
    2,
    3,
    4,
    5,
]
b = a |> array.map(fn: (x) => ({_value: x}))

// b returns [{_value: 1}, {_value: 2}, {_value: 3}, {_value: 4}, {_value: 5}]
// Output the array of records as a table
array.from(rows: b)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _value  |
| ------- |
| 1       |
| 2       |
| 3       |
| 4       |
| 5       |

{{% /expand %}}
{{< /expand-wrapper >}}
