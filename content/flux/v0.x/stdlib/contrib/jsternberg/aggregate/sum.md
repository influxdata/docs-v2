---
title: aggregate.sum() function
description: >
  `aggregate.sum()` constructs a sum aggregate for the column.
menu:
  flux_0_x_ref:
    name: aggregate.sum
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/sum
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L148-L155

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.sum()` constructs a sum aggregate for the column.



##### Function type signature

```js
(
    ?column: A,
    ?fill: B,
) => {
    reduce: (state: E, values: [E]) => E,
    init: (values: [D]) => D,
    fill: B,
    compute: (state: C) => C,
    column: A,
} where D: Numeric, E: Addable + Numeric
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Name of the column to aggregate.



### fill

When set, value to replace missing values.



