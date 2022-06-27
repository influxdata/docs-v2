---
title: aggregate.define() function
description: >
  `aggregate.define()` constructs an aggregate function record.
menu:
  flux_0_x_ref:
    name: aggregate.define
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/define
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L104-L112

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.define()` constructs an aggregate function record.



##### Function type signature

```js
(
    compute: A,
    init: B,
    reduce: C,
    ?fill: D,
) => (
    ?column: E,
    ?fill: F,
) => {
    reduce: C,
    init: B,
    fill: F,
    compute: A,
    column: E,
}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### init
({{< req >}})
Function to compute the initial state of the
output. This can return either the final aggregate or a
temporary state object that can be used to compute the
final aggregate. The `values` parameter will always be a
non-empty array of values from the specified column.



### reduce
({{< req >}})
Function that takes in another buffer of values
and the current state of the aggregate and computes
the updated state.



### compute
({{< req >}})
Function that takes the state and computes the final aggregate.



### fill

Value passed to `fill()`. If present, the fill value determines what
the aggregate does when there are no values.
This can either be a value or one of the predefined
identifiers, `null` or `none`.
This value must be the same type as the value return from
compute.



