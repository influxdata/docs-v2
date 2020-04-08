---
title: Fill gaps in data
seotitle: Fill gaps in data
list_title: Fill gaps
description: >
  Use the [`fill()` function](/v2.0/reference/flux/stdlib/built-in/transformations/fill/)
  to replace _null_ values in query results.
weight: 210
menu:
  v2_0:
    parent: Query with Flux
    name: Fill gaps
v2.0/tags: [query, fill]
list_code_example: |
  ```js
  data
    |> fill(usePrevious: true)
  ```
---

Use the [`fill()` function](/v2.0/reference/flux/stdlib/built-in/transformations/fill/)
to replace _null_ values in query results.

- Fill with a value
- Fill with previous
- Interpolate
