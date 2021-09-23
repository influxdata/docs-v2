---
title: Check if a value exists
seotitle: Use Flux to check if a value exists
list_title: Exists
description: >
  Use the Flux `exists` operator to check if a record contains a key or if that
  key's value is `null`.
influxdb/cloud/tags: [exists]
menu:
  influxdb_cloud:
    name: Exists
    parent: Query with Flux
weight: 220
related:
  - /influxdb/cloud/query-data/flux/query-fields/
  - /{{< latest "flux" >}}/stdlib/universe/filter/
list_code_example: |
  ##### Filter null values
  ```js
  data
    |> filter(fn: (r) => exists r._value)
  ```
---

{{< duplicate-oss >}}