---
title: array.toDuration() function
description: >
  `array.toDuration()` converts all values in an array to durations.
menu:
  flux_v0_ref:
    name: array.toDuration
    parent: experimental/array
    identifier: experimental/array/toDuration
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L208-L208

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.toDuration()` converts all values in an array to durations.

#### Supported array types and behaviors

- `[int]` (parsed as nanosecond epoch timestamps)
- `[string]` with values that use [duration literal](/flux/v0/data-types/basic/duration/#duration-syntax) representation.
- `[uint]` (parsed as nanosecond epoch timestamps)

##### Function type signature

```js
(<-arr: [A]) => [duration]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### arr

Array of values to convert. Default is the piped-forward array (`<-`).




## Examples

### Convert an array of integers to durations

```js
import "experimental/array"

arr = [80000000000, 56000000000, 132000000000]

array.toDuration(arr: arr)// Returns [1m20s, 56s, 2m12s]


```

