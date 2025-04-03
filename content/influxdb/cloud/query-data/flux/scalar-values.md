---
title: Extract scalar values in Flux
list_title: Extract scalar values
description: >
  Use Flux dynamic query functions to extract scalar values from Flux query output.
  This lets you, for example, dynamically set variables using query results.
menu:
  influxdb_cloud:
    name: Extract scalar values
    parent:  Query with Flux
weight: 220
influxdb/cloud/tags: [scalar]
related:
  - /flux/v0/function-types/#dynamic-queries, Flux dynamic query functions
list_code_example: |
  ```js
  scalarValue = (tables=<-) => {
      _record = tables
          |> findRecord(fn: (key) => true, idx: 0)

      return _record._value
  }
  ```
source: /shared/influxdb-v2/query-data/flux/scalar-values.md
---

<!-- The content of this file is at 
// SOURCE content/shared/influxdb-v2/query-data/flux/scalar-values.md-->