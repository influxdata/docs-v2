---
title: array.toFloat() function
description: >
  `array.toFloat()` converts all values in an array to floats.
menu:
  flux_v0_ref:
    name: array.toFloat
    parent: experimental/array
    identifier: experimental/array/toFloat
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L248-L248

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.toFloat()` converts all values in an array to floats.

#### Supported array types

- `[string]` (numeric, scientific notation, ±Inf, or NaN)
- `[bool]`
- `[int]`
- `[uint]`

##### Function type signature

```js
(<-arr: [A]) => [float]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### arr

Array of values to convert. Default is the piped-forward array (`<-`).




## Examples

- [Convert an array of integers to floats](#convert-an-array-of-integers-to-floats)
- [Convert an array of strings to floats](#convert-an-array-of-strings-to-floats)

### Convert an array of integers to floats

```js
import "experimental/array"

arr = [12, 24, 36, 48]

array.toFloat(arr: arr)// Returns [12.0, 24.0, 36.0, 48.0]


```


### Convert an array of strings to floats

```js
import "experimental/array"

arr = ["12", "1.23e+4", "NaN", "24.2"]

array.toFloat(arr: arr)// Returns [12.0, 1.2300, NaN, 24.2]


```

