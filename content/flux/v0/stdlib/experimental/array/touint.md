---
title: array.toUInt() function
description: >
  `array.toUInt()` converts all values in an array to unsigned integers.
menu:
  flux_v0_ref:
    name: array.toUInt
    parent: experimental/array
    identifier: experimental/array/toUInt
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/array/array.flux#L378-L378

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`array.toUInt()` converts all values in an array to unsigned integers.

#### Supported array types and behaviors

| Array type   | Returned array values                      |
| :----------- | :----------------------------------------- |
| `[bool]`     | 1 (true) or 0 (false)                      |
| `[duration]` | Number of nanoseconds in the  duration     |
| `[float]`    | Value truncated at the decimal             |
| `[int]`      | Unsigned integer equivalent of the integer |
| `[string]`   | Integer equivalent of the numeric string   |
| `[time]`     | Equivalent nanosecond epoch timestamp      |

##### Function type signature

```js
(<-arr: [A]) => [uint]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### arr

Array of values to convert. Default is the piped-forward array (`<-`).




## Examples

### Convert an array of floats to unsigned integers

```js
import "experimental/array"

arr = [-12.1, 24.2, -36.3, 48.4]

array.toInt(arr: arr)// Returns [18446744073709551604, 24, 18446744073709551580, 48]


```

