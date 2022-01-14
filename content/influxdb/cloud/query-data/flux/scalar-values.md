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
  - /{{< latest "flux" >}}/function-types/#dynamic-queries, Flux dynamic query functions
list_code_example: |
  ```js
  scalarValue = {
    _record =
      data
        |> findRecord(fn: key => true, idx: 0)
    return _record._value
  }
  ```
---

{{< duplicate-oss >}}