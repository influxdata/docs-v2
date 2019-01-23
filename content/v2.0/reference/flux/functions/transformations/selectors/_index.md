---
title: Flux selector functions
description: Flux selector functions return one or more records based on function logic.
menu:
  v2_0_ref:
    parent: Transformations
    name: Selectors
    weight: 1
---

Flux selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

The following selector functions are available:

{{< function-list category="Selectors" menu="v2_0_ref" >}}


### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as aggregate functions in this documentation:

- [median](/v2.0/reference/flux/functions/transformations/aggregates/median)
- [percentile](/v2.0/reference/flux/functions/transformations/aggregates/percentile)
