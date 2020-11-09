---
title: Extract scalar values in Flux
list_title: Extract scalar values
description: >
  Use Flux stream and table functions to extract scalar values from Flux query output.
  This lets you, for example, dynamically set variables using query results.
menu:
  influxdb_cloud:
    name: Extract scalar values
    parent:  Query with Flux
weight: 220
influxdb/cloud/tags: [scalar]
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/
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
---

{{< duplicate-oss >}}