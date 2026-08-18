---
title: Check if a value exists
seotitle: Use Flux to check if a value exists
list_title: Exists
description: >
  Use the `exists` operator to check if a row record contains a column or if a
  column's value is _null_.
menu:
  enterprise_influxdb_v1:
    name: Exists
    parent: Query with Flux
weight: 20
canonical: /influxdb/v2/query-data/flux/exists/
list_code_example: |
  ##### Filter null values
  ```js
  data
    |> filter(fn: (r) => exists r._value)
  ```
source: /shared/influxdb-v1/flux/guides/exists.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v1/flux/guides/exists.md -->
