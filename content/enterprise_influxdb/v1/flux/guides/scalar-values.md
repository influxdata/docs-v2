---
title: Extract scalar values in Flux
list_title: Extract scalar values
description: >
  Use Flux stream and table functions to extract scalar values from Flux query output.
  This lets you, for example, dynamically set variables using query results.
menu:
  enterprise_influxdb_v1:
    name: Extract scalar values
    parent:  Query with Flux
weight: 20
canonical: /influxdb/v2/query-data/flux/scalar-values/
list_code_example: |
  ```js
  scalarValue = {
    _record =
      data
        |> tableFind(fn: key => true)
        |> getRecord(idx: 0)
    return _record._value
  }
  ```
source: /shared/influxdb-v1/flux/guides/scalar-values.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v1/flux/guides/scalar-values.md -->
