---
title: Flux built-in selector functions
list_title: Built-in selector functions
description: Flux's built-in selector functions return one or more records based on function logic.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/selectors
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/selectors/
menu:
  influxdb_cloud_ref:
    parent: built-in-transformations
    name: Selectors
    identifier: built-in-selectors
weight: 401
influxdb/v2.0/tags: [selectors, built-in, functions]
related:
  - /influxdb/cloud/query-data/flux/window-aggregate/
---

Flux's built-in selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

The following selector functions are available:

{{< children type="functions" >}}


### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as aggregate functions in this documentation:

- [median](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/median)
- [quantile](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/quantile)
