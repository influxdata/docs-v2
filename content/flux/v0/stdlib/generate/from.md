---
title: generate.from() function
description: >
  `generate.from()` generates data using the provided parameter values.
menu:
  flux_v0_ref:
    name: generate.from
    parent: generate
    identifier: generate/from
weight: 101
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/generate/generate.flux#L37-L44

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`generate.from()` generates data using the provided parameter values.



##### Function type signature

```js
(count: int, fn: (n: int) => int, start: A, stop: A) => stream[{_value: int, _time: time, _stop: time, _start: time}] where A: Timeable
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### count
({{< req >}})
Number of rows to generate.



### fn
({{< req >}})
Function used to generate values.

The function takes an `n` parameter that represents the row index, operates
on `n`, and then returns an integer value. Rows use zero-based indexing.

### start
({{< req >}})
Beginning of the time range to generate values in.



### stop
({{< req >}})
End of the time range to generate values in.




## Examples

### Generate sample data

```js
import "generate"

generate.from(
    count: 6,
    fn: (n) => (n + 1) * (n + 2),
    start: 2021-01-01T00:00:00Z,
    stop: 2021-01-02T00:00:00Z,
)

```

