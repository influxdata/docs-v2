---
title: length() function
description: >
  `length()` returns the number of elements in an array.
menu:
  flux_v0_ref:
    name: length
    parent: universe
    identifier: universe/length
weight: 101

introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3588-L3588

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`length()` returns the number of elements in an array.



##### Function type signature

```js
(<-arr: [A]) => int
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### arr

Array to evaluate. Default is the piped-forward array (`<-`).




## Examples

### Return the length of an array

```js
people = ["John", "Jane", "Abed"]

people |> length()// Returns 3


```

