---
title: Create custom Flux functions
description: Create your own custom Flux functions to transform and operate on data.
list_title: Custom functions
influxdb/v2/tags: [functions, custom, flux]
menu:
  influxdb_v2:
    name: Custom functions
    parent: Query with Flux
weight: 220
aliases:
  - /influxdb/v2/query-data/guides/custom-functions/
list_code_example: |
  ```js
  multByX = (tables=<-, x) => tables
      |> map(fn: (r) => ({r with _value: r._value * x}))

  data
      |> multByX(x: 2.0)
  ```
source: /shared/influxdb-v2/query-data/flux/custom-functions/_index.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/custom-functions/_index.md -->
