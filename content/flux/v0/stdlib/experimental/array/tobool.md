---
title: array.toBool() function
description: >
  `array.toBool()` converts all values in an array to booleans.
menu:
  flux_v0_ref:
    name: array.toBool
    parent: experimental/array
    identifier: experimental/array/toBool
weight: 201
flux/v0/tags: [type-conversions]
introduced: 0.184.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L179-L179

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.toBool()` converts all values in an array to booleans.

#### Supported array types

- `[string]` with values `true` or `false`
- `[int]` with values `1` or `0`
- `[uint]` with values `1` or `0`
- `[float]` with values `1.0` or `0.0`

##### Function type signature

```js
(<-arr: [A]) => [bool]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### arr

Array of values to convert. Default is the piped-forward array (`<-`).




## Examples

### Convert an array of integers to booleans

```js
import "experimental/array"

arr = [
    1,
    1,
    0,
    1,
    0,
]

array.toBool(arr: arr)// Returns [true, true, false, true, false]


```

