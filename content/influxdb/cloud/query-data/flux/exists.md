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
  - /flux/v0/stdlib/universe/filter/
list_code_example: |
  ##### Filter null values
  ```js
  data
      |> filter(fn: (r) => exists r._value)
  ```
source: /shared/influxdb-v2/query-data/flux/exists.md
---

<!-- The content of this file is at 
// SOURCE content/shared/influxdb-v2/query-data/flux/exists.md-->