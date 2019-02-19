---
title: Flux built-in selector functions
description: Flux's built-in selector functions return one or more records based on function logic.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors
menu:
  v2_0_ref:
    parent: built-in-transformations
    name: Selectors
    identifier: built-in-selectors
weight: 401
---

Flux's built-in selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

The following selector functions are available:

{{< children type="functions" >}}


### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as aggregate functions in this documentation:

- [median](/v2.0/reference/flux/functions/built-in/transformations/aggregates/median)
- [percentile](/v2.0/reference/flux/functions/built-in/transformations/aggregates/percentile)
