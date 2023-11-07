---
title: array.toTime() function
description: >
  `array.toTime()` converts all values in an array to times.
menu:
  flux_v0_ref:
    name: array.toTime
    parent: experimental/array
    identifier: experimental/array/toTime
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L344-L344

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.toTime()` converts all values in an array to times.

#### Supported array types

- `[int]` (parsed as nanosecond epoch timestamps)
- `[string]` with values that use [time literal](/flux/v0/data-types/basic/time/#time-syntax)
   representation (RFC3339 timestamps).
- `[uint]` (parsed as nanosecond epoch timestamps)

##### Function type signature

```js
(<-arr: [A]) => [time]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### arr

Array of values to convert. Default is the piped-forward array (`<-`).




## Examples

### Convert an array of integers to time values

```js
import "experimental/array"

arr = [1640995200000000000, 1643673600000000000, 1646092800000000000]

array.toTime(arr: arr)// Returns [2022-01-01T00:00:00Z, 2022-02-01T00:00:00Z, 2022-03-01T00:00:00Z]


```

