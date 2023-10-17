---
title: array.toString() function
description: >
  `array.toString()` converts all values in an array to strings.
menu:
  flux_v0_ref:
    name: array.toString
    parent: experimental/array
    identifier: experimental/array/toString
weight: 201
flux/v0.x/tags: [type-conversions]
introduced: 0.184.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L314-L314

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.toString()` converts all values in an array to strings.

#### Supported array types

- `[bool]`
- `[duration]`
- `[float]`
- `[int]`
- `[time]`
- `[uint]`

##### Function type signature

```js
(<-arr: [A]) => [string]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### arr

Array of values to convert. Default is the piped-forward array (`<-`).




## Examples

### Convert an array of floats to strings

```js
import "experimental/array"

arr = [12.0, 1.2300, NaN, 24.2]

array.toString(arr: arr)// Returns ["12.0", "1.2300", "NaN", "24.2"]


```

