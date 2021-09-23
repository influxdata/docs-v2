---
title: Query using conditional logic
seotitle: Query using conditional logic in Flux
list_title: Conditional logic
description: >
  This guide describes how to use Flux conditional expressions, such as `if`,
  `else`, and `then`, to query and transform data. **Flux evaluates statements from left to right and stops evaluating once a condition matches.**
influxdb/cloud/tags: [conditionals, flux]
menu:
  influxdb_cloud:
    name: Conditional logic
    parent: Query with Flux
weight: 220
related:
  - /influxdb/cloud/query-data/flux/query-fields/
  - /{{< latest "flux" >}}/stdlib/universe/filter/
  - /{{< latest "flux" >}}/stdlib/universe/map/
  - /{{< latest "flux" >}}/stdlib/universe/reduce/
list_code_example: |
  ```js
  if color == "green" then "008000" else "ffffff"
  ```
---

{{< duplicate-oss >}}