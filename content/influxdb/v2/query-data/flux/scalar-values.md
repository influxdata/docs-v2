---
title: Extract scalar values in Flux
list_title: Extract scalar values
description: >
  Use Flux dynamic query functions to extract scalar values from Flux query output.
  This lets you, for example, dynamically set variables using query results.
menu:
  influxdb_v2:
    name: Extract scalar values
    parent:  Query with Flux
weight: 220
influxdb/v2/tags: [scalar]
related:
  - /flux/v0/function-types/#dynamic-queries, Flux dynamic query functions
aliases:
  - /influxdb/v2/query-data/guides/scalar-values/
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

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/scalar-values.md -->
