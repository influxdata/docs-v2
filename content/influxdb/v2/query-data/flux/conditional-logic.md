---
title: Query using conditional logic
seotitle: Query using conditional logic in Flux
list_title: Conditional logic
description: >
  This guide describes how to use Flux conditional expressions, such as `if`,
  `else`, and `then`, to query and transform data. **Flux evaluates statements from left to right and stops evaluating once a condition matches.**
influxdb/v2/tags: [conditionals, flux]
menu:
  influxdb_v2:
    name: Conditional logic
    parent: Query with Flux
weight: 220
aliases:
  - /influxdb/v2/query-data/guides/conditional-logic/
related:
  - /influxdb/v2/query-data/flux/query-fields/
  - /flux/v0/stdlib/universe/filter/
  - /flux/v0/stdlib/universe/map/
  - /flux/v0/stdlib/universe/reduce/
list_code_example: |
  ```js
  if color == "green" then "008000" else "ffffff"
  ```
source: /shared/influxdb-v2/query-data/flux/conditional-logic.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/conditional-logic.md -->
