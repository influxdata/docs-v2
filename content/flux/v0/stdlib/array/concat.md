---
title: array.concat() function
description: >
  `array.concat()` appends two arrays and returns a new array.
menu:
  flux_v0_ref:
    name: array.concat
    parent: array
    identifier: array/concat
weight: 101

introduced: 0.173.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/array/array.flux#L76-L76

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.concat()` appends two arrays and returns a new array.



Neither input array is mutated and a new array is returned.

##### Function type signature

```js
(<-arr: [A], v: [A]) => [A]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### arr

First array. Default is the piped-forward array (`<-`).



### v
({{< req >}})
Array to append to the first array.




## Examples

### Merge two arrays

```js
import "array"

a = [1, 2, 3]
b = [4, 5, 6]

c = a |> array.concat(v: b)

// Returns [1, 2, 3, 4, 5, 6]
// Output each value in the array as a row in a table
array.from(rows: c |> array.map(fn: (x) => ({_value: x})))

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
| 6       |

{{% /expand %}}
{{< /expand-wrapper >}}
