---
title: Query using conditional logic
seotitle: Query using conditional logic in Flux
list_title: Conditional logic
description: >
  This guide describes how to use Flux conditional expressions, such as `if`,
  `else`, and `then`, to query and transform data. **Flux evaluates statements from left to right and stops evaluating once a condition matches.**
menu:
  influxdb_v1:
    name: Conditional logic
    parent: Query with Flux
weight: 20
canonical: /influxdb/v2/query-data/flux/conditional-logic/
alt_links:
  v2: /influxdb/v2/query-data/flux/conditional-logic/
list_code_example: |
  ```js
  if color == "green" then "008000" else "ffffff"
  ```
source: /shared/influxdb-v1/flux/guides/conditional-logic.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v1/flux/guides/conditional-logic.md -->
