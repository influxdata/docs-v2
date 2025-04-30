---
title: Check if a value exists
seotitle: Use Flux to check if a value exists
list_title: Exists
description: >
  Use the Flux `exists` operator to check if a row record contains a column or if
  that column's value is `null`.
influxdb/v2/tags: [exists]
menu:
  influxdb_v2:
    name: Exists
    parent: Query with Flux
weight: 220
aliases:
  - /influxdb/v2/query-data/guides/exists/
related:
  - /influxdb/v2/query-data/flux/query-fields/
  - /flux/v0/stdlib/universe/filter/
list_code_example: |
  ##### Filter null values
  ```js
  data
    |> filter(fn: (r) => exists r._value)
  ```
source: /shared/influxdb-v2/query-data/flux/exists.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/exists.md -->
