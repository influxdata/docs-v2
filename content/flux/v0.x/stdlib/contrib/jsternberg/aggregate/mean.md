---
title: aggregate.mean() function
description: >
  `aggregate.mean()` constructs a mean aggregate for the column.
menu:
  flux_0_x_ref:
    name: aggregate.mean
    parent: contrib/jsternberg/aggregate
    identifier: contrib/jsternberg/aggregate/mean
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/aggregate/aggregate.flux#L172-L177

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.mean()` constructs a mean aggregate for the column.



##### Function type signature

```js
aggregate.mean = (
    ?column: A,
    ?fill: B,
) => {
    reduce: (state: {G with sum: H, count: int}, values: [H]) => {sum: H, count: int},
    init: (values: [F]) => {sum: F, count: int},
    fill: B,
    compute: (state: {C with sum: E, count: D}) => float,
    column: A,
} where F: Numeric, H: Addable + Numeric
```

## Parameters

### column


Name of the column to aggregate.

### fill


When set, value to replace missing values.

